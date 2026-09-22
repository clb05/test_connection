Design a modern, professional web-based disaster monitoring and flood forecasting system called **T.U.B.I.G. (Targeted Ubiquitous Basin Instrumentation for Geospatial Flood Forecasting)**.

The system is designed for flood-prone communities in **Sitio Tagbakin, Barangay Halang, Lipa City, Batangas, Philippines**. Its purpose is to monitor water levels and environmental conditions, visualize flood information geographically, provide flood forecasting, and deliver timely warnings to residents, local government units, and disaster-response personnel.

## Overall Design

Create a clean, modern, responsive web dashboard suitable for a **BSCS thesis prototype and defense**.

Use a professional **dark blue, white, and light cyan/teal** color palette inspired by water, technology, and disaster monitoring.

Use:

* Clear modern typography
* Rounded cards
* Subtle shadows
* Simple line icons
* Data visualization
* Status badges
* Responsive layouts
* Consistent spacing

The interface should look like a realistic **IoT flood monitoring and geospatial forecasting system**, not a generic analytics dashboard.

## Main Navigation

Create a left sidebar containing:

* T.U.B.I.G. Logo
* Dashboard
* Flood Monitoring
* Geospatial Map
* Forecasting
* Alerts & Warnings
* Sensor Status
* Historical Data
* Reports
* Settings

At the bottom of the sidebar:

**LGU / Disaster Response Administrator**

## Main Dashboard

Create a dashboard showing the current condition of the monitoring station.

### Current Flood Status

Display:

**Current Status: 2nd Warning**

Include:

* Large warning indicator
* Current water-level reading
* Last updated timestamp
* Overall sensor condition

### Water Sensor Monitoring

Create four clearly visible sensor cards.

**Water Sensor 1**

* Status: **NORMAL**
* Indicator: Green
* Description: Water level is within the normal range.

**Water Sensor 2**

* Status: **1ST WARNING**
* Indicator: Yellow
* Description: Water level is rising and requires monitoring.

**Water Sensor 3**

* Status: **2ND WARNING**
* Indicator: Orange
* Description: Water level has reached a dangerous level and preparation is required.

**Water Sensor 4**

* Status: **CRITICAL WARNING**
* Indicator: Red
* Description: Critical water level detected. Immediate response is required.

Make the four sensors visually represent increasing water levels from Sensor 1 to Sensor 4.

## Flood Monitoring

Create a dedicated monitoring page showing:

* Current water level
* Water sensor status
* Rainfall intensity
* Environmental conditions
* Sensor readings
* Current warning level
* Last data update
* Monitoring station status

Display the four sensors in a vertical or horizontal water-level visualization.

The visualization should clearly show:

**Sensor 1 → Normal**

**Sensor 2 → 1st Warning**

**Sensor 3 → 2nd Warning**

**Sensor 4 → Critical Warning**

Use progressively stronger visual indicators as the water level increases.

## Geospatial Flood Map

Create a large interactive map focused on:

**Sitio Tagbakin, Barangay Halang, Lipa City, Batangas**

The map should display:

* Monitoring station
* Water sensor monitoring points
* River/waterway
* Flood-prone areas
* Community areas
* Flood-risk zones
* Current warning status

Use map zones representing:

* Normal
* 1st Warning
* 2nd Warning
* Critical Warning

Add a monitoring-station popup containing:

**Station ID**
**Current Water Level**
**Current Warning Level**
**Rainfall**
**Sensor Status**
**Last Updated**

## Sensor Monitoring Page

Create a dedicated IoT sensor monitoring interface.

The prototype hardware consists of:

* ESP32 microcontroller
* GPS module
* GSM module for SMS alerts
* 4 water sensors
* 4 LED indicator lights
* Battery power supply

**Do NOT include a solar panel anywhere in the design.**

Display the four water sensors as individual monitoring cards:

### Water Sensor 1

**NORMAL**

Water level is within the safe range.

### Water Sensor 2

**1ST WARNING**

Water level is increasing. Continue monitoring.

### Water Sensor 3

**2ND WARNING**

Water level is at a dangerous level. Prepare for possible flooding.

### Water Sensor 4

**CRITICAL WARNING**

Critical water level detected. Immediate emergency response required.

Also show the corresponding LED indicator status for each sensor.

## Flood Forecasting Page

Create a dedicated forecasting interface showing:

* Current water level
* Historical water level
* Rainfall data
* Forecasted water level
* Flood-risk prediction
* Prediction confidence
* Forecast timeline

Use clean line charts and area charts.

Include a prominent prediction card:

**Flood Risk Prediction**

Current Level: **2nd Warning**

Forecast Period: **Next 6 Hours**

Predicted Peak Water Level: **[Value]**

Risk Probability: **[Percentage]**

## Alerts & Warnings

Create an emergency alert management interface based on the four sensor warning levels.

### Normal

No immediate threat.

### 1st Warning

Water level is increasing. Continue monitoring.

### 2nd Warning

Dangerous water level detected. Prepare for possible flooding.

### Critical Warning

Critical water level detected. Immediate response is required.

Include buttons:

* Send SMS Alert
* Issue Warning
* Notify LGU
* Notify Disaster Response Team

Show:

* Alert history
* Alert severity
* Date and time
* Recipient
* SMS delivery status

## Historical Data

Create a data analytics page where administrators can view historical:

* Water levels
* Sensor readings
* Rainfall intensity
* Temperature
* Flood events
* Warning levels
* Alerts issued

Include:

* Date filters
* Sensor filters
* Location filters
* Line charts
* Bar charts
* Data tables

## Reports

Create a report-generation page containing:

* Daily Monitoring Report
* Weekly Flood Report
* Monthly Flood Report
* Sensor Performance Report
* Warning History
* Flood Prediction Accuracy

Include a **Generate Report** button and a clean report preview.

## System Status

Create a system health panel showing:

**ESP32:** Online
**GPS:** Connected
**GSM:** Connected
**Water Sensor 1:** Normal
**Water Sensor 2:** 1st Warning
**Water Sensor 3:** 2nd Warning
**Water Sensor 4:** Critical Warning
**Battery:** [Battery Percentage]

Do not display or mention solar charging or solar panels.

## Header

The top header should contain:

**T.U.B.I.G. Flood Monitoring System**

Include:

* Current date and time
* System connection status
* Notification icon
* Administrator profile

## Figma Frames

Create the following complete Figma screens:

1. Login
2. Main Dashboard
3. Flood Monitoring
4. Geospatial Map
5. Flood Forecasting
6. Sensor Monitoring
7. Alerts & Warnings
8. Historical Data
9. Reports
10. System Settings

Maintain consistent components throughout the entire design.

Use reusable components for:

* Sensor cards
* Warning badges
* Status indicators
* Navigation
* Buttons
* Charts
* Tables
* Map markers
* Alert cards
* Notification panels

The final interface should look like a **professional IoT + GIS + flood forecasting platform for a Philippine local government disaster-response environment**.

The most important visual hierarchy should clearly communicate the progression:

**NORMAL → 1ST WARNING → 2ND WARNING → CRITICAL WARNING**

The system should emphasize **real-time water monitoring, geospatial visualization, flood forecasting, SMS warnings, and disaster-response decision support**.
