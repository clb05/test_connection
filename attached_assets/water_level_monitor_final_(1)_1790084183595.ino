/*
  ESP32 Water Level Monitoring + SMS Alert System - FINAL
  Hardware: ESP32 DevKit V1, SIM800L, NEO-6M GPS, 4x resistive water level sensors, 4x LEDs

  This combines:
    - The tested GPS + sensor + LED logic (instant hysteresis-based LED response,
      Level 0 = fully dry = all LEDs off)
    - SIM800L SMS alerts, added back in without changing the sensor/LED/GPS logic

  Power:
    ESP32    powered from a 9V battery into the VIN pin (through a 1N4001/1N4007 diode
             for reverse-polarity protection). Do NOT feed 9V into the 5V or 3V3 pins.
    SIM800L  VCC -> EXTERNAL 4.0V/2A supply + 1000-2200uF cap. NOT the ESP32 rail.

  Wiring summary:
    SIM800L  TXD -> GPIO16 (ESP32 RX2)   SIM800L RXD -> GPIO17 (ESP32 TX2)
    NEO-6M   TXD -> GPIO26 (ESP32 RX1)   NEO-6M  RXD -> GPIO27 (ESP32 TX1) [optional]
    Sensor 1 AOUT -> GPIO34   Sensor 2 AOUT -> GPIO35
    Sensor 3 AOUT -> GPIO32   Sensor 4 AOUT -> GPIO33
    LEDs     -> GPIO18 (green) / 19 (blue) / 21 (yellow) / 22 (red), each with a resistor
    All GNDs must be common (ESP32, SIM800L, GPS, sensors, LEDs).

  Library required: TinyGPSPlus (Mikal Hart) - install via Arduino Library Manager
*/

#include <HardwareSerial.h>
#include <TinyGPSPlus.h>
#include <WiFi.h>
#include <SocketIOclient.h>   // Links2004/arduinoWebSockets - install via Library Manager
#include <ArduinoJson.h>      // install via Library Manager

// ---------------- WiFi + Website (Socket.IO) config ----------------
// NOTE: your board has NO WiFi hardware wired per your notes (SIM800L is cellular-only).
// This assumes you ARE adding WiFi connectivity to reach the Replit site. If the board
// will only ever have GSM/SIM800L data, this section needs a GPRS-based approach instead
// (different from what's below) - let me know and I'll swap it out.
const char* WIFI_SSID     = "YOUR_WIFI_SSID";       // <-- CHANGE
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // <-- CHANGE

// Replit apps serve over HTTPS/WSS on port 443 with the app's subdomain as host.
const char* SOCKETIO_HOST = "testconnection--webbasedpersona.replit.app"; // <-- CONFIRM
const int   SOCKETIO_PORT = 443;
const bool  SOCKETIO_USE_SSL = true; // Replit apps require SSL - do not set to false

// PLACEHOLDER - confirm against server/index.js or App.tsx's socket.on(...) calls.
// This is the event name + payload shape the ESP32 will emit. Rename to match the
// actual site once you can see its socket event names.
const char* SOCKETIO_EVENT_NAME = "waterLevel";

SocketIOclient socketIO;
bool socketIOConnected = false;

// ---------------- Pin definitions ----------------
#define SIM800_RX_PIN   16   // ESP32 RX2  <- SIM800L TXD
#define SIM800_TX_PIN   17   // ESP32 TX2  -> SIM800L RXD

#define GPS_RX_PIN      26   // ESP32 RX1  <- NEO-6M TXD
#define GPS_TX_PIN      27   // ESP32 TX1  -> NEO-6M RXD (optional)

#define SENSOR1_PIN     34   // Level 1 - SAFE WATER LEVEL (lowest mounted)
#define SENSOR2_PIN     35   // Level 2 - NORMAL WATER LEVEL
#define SENSOR3_PIN     32   // Level 3 - FLOODING POSSIBLY OCCURRING
#define SENSOR4_PIN     33   // Level 4 - SEVERE FLOODING DANGER (highest mounted)

#define LED1_PIN        18   // Green  - Level 1
#define LED2_PIN        19   // Blue   - Level 2
#define LED3_PIN        21   // Yellow - Level 3
#define LED4_PIN        22   // Red    - Level 4

// ---------------- Tunables ----------------
// Hysteresis thresholds per sensor - prevents flicker when a reading hovers
// right at the boundary. Calibrated from observed readings: dry ~0, wet ~700-1150.
#define ON_THRESHOLD    450   // reading must rise above this to count as "wet"
#define OFF_THRESHOLD   300   // reading must drop below this to count as "dry" again

#define SENSOR_PRINT_INTERVAL  1000   // ms between raw sensor print lines (LED response is instant, not throttled)
#define GPS_PRINT_INTERVAL     3000   // ms between GPS status prints

// Recipients to notify (add more lines / loop as needed)
const char* PHONE_NUMBERS[] = { "+639171234567" }; // <-- CHANGE to your real number(s)
const int NUM_RECIPIENTS = 1;

// ---------------- Globals ----------------
HardwareSerial sim800(2);    // UART2
HardwareSerial gpsSerial(1); // UART1
TinyGPSPlus gps;

bool sensorWet[5] = {false, false, false, false, false}; // index 1-4 used, per-sensor latched wet/dry state
int lastSentLevel = 0; // 0 = dry / no alert sent yet

unsigned long lastSensorPrint = 0;
unsigned long lastGpsPrint = 0;

// ---------------- WiFi + Socket.IO ----------------
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      socketIOConnected = false;
      Serial.println(F("[SocketIO] Disconnected"));
      break;
    case sIOtype_CONNECT:
      socketIOConnected = true;
      Serial.println(F("[SocketIO] Connected to site"));
      // Join default namespace
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:
      Serial.print(F("[SocketIO] Event received: "));
      Serial.println((char*)payload);
      break;
    default:
      break;
  }
}

void connectWiFiAndSocketIO() {
  Serial.print(F("Connecting to WiFi"));
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long wifiStart = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - wifiStart < 20000) {
    delay(500);
    Serial.print(F("."));
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print(F("WiFi connected, IP: "));
    Serial.println(WiFi.localIP());

    socketIO.beginSSL(SOCKETIO_HOST, SOCKETIO_PORT, "/socket.io/?EIO=4&transport=websocket");
    socketIO.onEvent(socketIOEvent);
    socketIO.setReconnectInterval(5000);
  } else {
    Serial.println();
    Serial.println(F("WiFi connect FAILED - will retry in loop()"));
  }
}

// Sends the current level + GPS location to the website over Socket.IO.
// PLACEHOLDER payload shape - confirm field names against the site's code.
void sendWebsiteUpdate(int level) {
  if (!socketIOConnected) return;

  DynamicJsonDocument doc(256);
  JsonArray array = doc.to<JsonArray>();
  array.add(SOCKETIO_EVENT_NAME);

  JsonObject data = array.createNestedObject();
  data["level"] = level;
  if (gps.location.isValid()) {
    data["lat"] = gps.location.lat();
    data["lng"] = gps.location.lng();
  }

  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);

  Serial.print(F("[SocketIO] Sent: "));
  Serial.println(output);
}

// ---------------- Setup ----------------
void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);

  analogReadResolution(12); // 0-4095

  sim800.begin(9600, SERIAL_8N1, SIM800_RX_PIN, SIM800_TX_PIN);
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);

  Serial.println(F("Initializing SIM800L..."));
  initSIM800L();

  updateOutputs(0);

  connectWiFiAndSocketIO();

  Serial.println(F("System ready."));
}

// ---------------- Main loop ----------------
void loop() {
  socketIO.loop(); // keep the website connection alive - does not block sensor/LED timing

  // Continuously feed GPS parser
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Update LEDs immediately, every loop iteration - instant response
  int level = readCurrentLevel();
  updateOutputs(level);

  // Send an SMS only when the level actually changes from the last one sent
  if (level != lastSentLevel) {
    lastSentLevel = level;
    Serial.print(F(">>> Water level changed to: "));
    Serial.println(level);
    if (level >= 1) {
      sendAlertSMS(level);
    }
    sendWebsiteUpdate(level); // push the same level change to the website
  }

  // Print GPS status periodically (throttled, doesn't affect LED/SMS speed)
  if (millis() - lastGpsPrint >= GPS_PRINT_INTERVAL) {
    lastGpsPrint = millis();
    printGpsStatus();
  }

  // Print raw sensor values periodically (throttled, doesn't affect LED/SMS speed)
  if (millis() - lastSensorPrint >= SENSOR_PRINT_INTERVAL) {
    lastSensorPrint = millis();
    printSensorStatus(level);
  }
}

// ---------------- Sensors + LEDs ----------------
int readCurrentLevel() {
  int raw[5];
  raw[1] = analogRead(SENSOR1_PIN);
  raw[2] = analogRead(SENSOR2_PIN);
  raw[3] = analogRead(SENSOR3_PIN);
  raw[4] = analogRead(SENSOR4_PIN);

  for (int i = 1; i <= 4; i++) {
    if (!sensorWet[i] && raw[i] > ON_THRESHOLD) {
      sensorWet[i] = true;
    } else if (sensorWet[i] && raw[i] < OFF_THRESHOLD) {
      sensorWet[i] = false;
    }
  }

  int level = 0; // 0 = dry, no sensor triggered - all LEDs stay off, no SMS
  if (sensorWet[4])      level = 4;
  else if (sensorWet[3]) level = 3;
  else if (sensorWet[2]) level = 2;
  else if (sensorWet[1]) level = 1;

  return level;
}

void printSensorStatus(int level) {
  int s1 = analogRead(SENSOR1_PIN);
  int s2 = analogRead(SENSOR2_PIN);
  int s3 = analogRead(SENSOR3_PIN);
  int s4 = analogRead(SENSOR4_PIN);

  Serial.print(F("[Sensors] raw  S1="));
  Serial.print(s1);
  Serial.print(sensorWet[1] ? F("(wet)") : F("(dry)"));
  Serial.print(F("  S2="));
  Serial.print(s2);
  Serial.print(sensorWet[2] ? F("(wet)") : F("(dry)"));
  Serial.print(F("  S3="));
  Serial.print(s3);
  Serial.print(sensorWet[3] ? F("(wet)") : F("(dry)"));
  Serial.print(F("  S4="));
  Serial.print(s4);
  Serial.print(sensorWet[4] ? F("(wet)") : F("(dry)"));
  Serial.print(F("  -> Level "));
  Serial.println(level);
}

void updateOutputs(int level) {
  // Level 0 = dry, no water detected at all -> every LED stays off
  digitalWrite(LED1_PIN, level == 1 ? HIGH : LOW);
  digitalWrite(LED2_PIN, level == 2 ? HIGH : LOW);
  digitalWrite(LED3_PIN, level == 3 ? HIGH : LOW);
  digitalWrite(LED4_PIN, level == 4 ? HIGH : LOW);
}

// ---------------- GPS ----------------
void printGpsStatus() {
  Serial.print(F("[GPS] Satellites: "));
  Serial.print(gps.satellites.isValid() ? gps.satellites.value() : 0);

  if (gps.location.isValid()) {
    Serial.print(F(" | Lat: "));
    Serial.print(gps.location.lat(), 6);
    Serial.print(F(" | Lng: "));
    Serial.println(gps.location.lng(), 6);
  } else {
    Serial.println(F(" | No GPS fix yet"));
  }

  if (gps.charsProcessed() < 10) {
    Serial.println(F("[GPS] WARNING: no NMEA data received - check TXD/RXD wiring and 3.3V/GND"));
  }
}

String getGPSLocationText() {
  if (gps.location.isValid()) {
    String lat = String(gps.location.lat(), 6);
    String lng = String(gps.location.lng(), 6);
    String mapsLink = "https://maps.google.com/?q=" + lat + "," + lng;
    return "Location: " + lat + "," + lng + " " + mapsLink;
  } else {
    return "Location: GPS fix not available yet";
  }
}

// ---------------- SIM800L ----------------
void initSIM800L() {
  sendATCommand("AT", 1000);
  sendATCommand("ATE0", 1000);        // echo off
  sendATCommand("AT+CMGF=1", 1000);   // text mode SMS
  sendATCommand("AT+CREG?", 1000);    // check network registration (see Serial monitor)
}

String sendATCommand(const char* cmd, unsigned long timeout) {
  sim800.println(cmd);
  unsigned long start = millis();
  String response = "";
  while (millis() - start < timeout) {
    while (sim800.available()) {
      response += (char)sim800.read();
    }
  }
  Serial.print(F("AT> "));
  Serial.print(cmd);
  Serial.print(F(" -> "));
  Serial.println(response);
  return response;
}

void sendAlertSMS(int level) {
  String locationText = getGPSLocationText();
  String message = buildMessageForLevel(level, locationText);

  for (int i = 0; i < NUM_RECIPIENTS; i++) {
    Serial.print(F("Sending SMS to "));
    Serial.println(PHONE_NUMBERS[i]);

    sim800.print("AT+CMGS=\"");
    sim800.print(PHONE_NUMBERS[i]);
    sim800.println("\"");
    delay(500); // wait for '>' prompt

    sim800.print(message);
    delay(200);
    sim800.write(0x1A); // Ctrl+Z sends the message
    delay(3000);        // give the module time to actually transmit

    Serial.println(F("SMS send attempted."));
  }
}

String buildMessageForLevel(int level, const String &locationText) {
  String header;
  switch (level) {
    case 1: header = "SAFE WATER LEVEL"; break;
    case 2: header = "NORMAL WATER LEVEL"; break;
    case 3: header = "WARNING: FLOODING POSSIBLY OCCURRING"; break;
    case 4: header = "DANGER: SEVERE FLOODING"; break;
    default: header = "STATUS UPDATE"; break;
  }

  String msg = "[FLOOD MONITOR] Level " + String(level) + " - " + header + "\n" + locationText;
  return msg;
}
