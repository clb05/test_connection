# ESP32 website connection

The website accepts water-level readings at:

```text
POST /api/readings
Content-Type: application/json
X-API-Key: <DEVICE_API_KEY>
```

For a deployed site, send the request to the deployed origin followed by
`/api/readings`. For local testing, use the computer's LAN IP and port 3001,
for example `http://192.168.1.20:3001/api/readings`.

## Payload

The minimum payload is:

```json
{
  "level": 2,
  "status": "Yellow",
  "lat": 13.9416,
  "lng": 121.1631,
  "battery": 88
}
```

Optional fields:

The `timestamp` field is optional. If omitted, the server uses its receive time.

`level` must be an integer from `0` to `4`. `lat` and `lng` must be valid GPS
coordinates. The server also accepts `latitude` and `longitude` as aliases.
After a valid request, it returns HTTP `201` and broadcasts the reading to
the dashboard over Socket.IO, so an open dashboard updates immediately.
Readings are stored in PostgreSQL and retained for the configured 48-hour
window, including across backend restarts and autoscale instance changes.

## Exact request and response

```text
POST https://testconnection--webbasedpersona.replit.app/api/readings
Content-Type: application/json
X-API-Key: <DEVICE_API_KEY>
```

```json
{
  "level": 2,
  "status": "Yellow",
  "lat": 13.9416,
  "lng": 121.1631,
  "battery": 88
}
```

Success response: HTTP `201 Created`.

```json
{
  "id": "reading-123",
  "level": 2,
  "lat": 13.9416,
  "lng": 121.1631,
  "timestamp": "2026-09-22T08:30:00.000Z",
  "receivedAt": "2026-09-22T08:30:00.250Z",
  "smsSent": false,
  "status": "Yellow",
  "battery": 88
}
```

Missing or invalid API keys return HTTP `401`. If the server has not been
configured with a device key, it returns HTTP `503` instead of accepting
unauthenticated readings.

## Important firmware limitation

The supplied `water_level_monitor_final.ino` was left unchanged. Its current
network behavior is limited to sending SMS through the SIM800L; it does not
send an HTTP request or open a GPRS data session. The website cannot receive
sensor readings from that sketch through a server-only change.

To make the physical device populate this dashboard, use one of these
compatible approaches:

1. Add an HTTP/GPRS upload layer to the firmware in a separate, approved
   firmware revision. It should POST the payload above at a regular interval.
2. Run a local gateway that reads the ESP32's serial output, converts each
   reading to the payload above, and POSTs it to this endpoint. A gateway must
   run on a computer physically connected to the ESP32; it cannot run inside
   the deployed website.

Do not use placeholder GPS coordinates in production. If the GPS has no fix,
the uploader should wait and retry rather than sending an invalid location.

## Quick endpoint check

```bash
curl -i -X POST http://127.0.0.1:3001/api/readings \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: replace-with-a-long-random-device-key' \
  -d '{"level":2,"status":"Yellow","lat":13.9416,"lng":121.1631,"battery":88}'
```
