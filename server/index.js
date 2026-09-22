import http from 'node:http'
import path from 'node:path'
import express from 'express'
import { Server as SocketIOServer } from 'socket.io'

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10)
const TEN_MINUTES = 10 * 60 * 1000

const app = express()
const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer)

const readings = []
let nextReadingId = 1

app.use(express.json({ limit: '32kb' }))

function getDeviceStatus() {
  const latest = readings.at(-1)
  const lastSeenAt = latest?.receivedAt ?? null
  const online = lastSeenAt ? Date.now() - new Date(lastSeenAt).getTime() <= TEN_MINUTES : false
  return {
    online,
    lastSeenAt,
    status: latest?.status ?? null,
    battery: latest?.battery ?? null,
  }
}

function parseReading(body) {
  const level = Number(body?.level)
  const lat = Number(body?.lat ?? body?.latitude)
  const lng = Number(body?.lng ?? body?.longitude)
  const timestamp = body?.timestamp ? new Date(body.timestamp) : new Date()
  const battery = body?.battery == null || body.battery === '' ? undefined : Number(body.battery)
  const status = typeof body?.status === 'string' && body.status.trim() ? body.status.trim() : undefined

  if (!Number.isInteger(level) || level < 0 || level > 4) {
    throw new Error('level must be an integer from 0 to 4')
  }
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    throw new Error('lat must be a number between -90 and 90')
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    throw new Error('lng must be a number between -180 and 180')
  }
  if (Number.isNaN(timestamp.getTime())) {
    throw new Error('timestamp must be a valid date')
  }
  if (battery !== undefined && (!Number.isFinite(battery) || battery < 0 || battery > 100)) {
    throw new Error('battery must be a number between 0 and 100')
  }

  return {
    id: `reading-${nextReadingId++}`,
    level,
    lat,
    lng,
    timestamp: timestamp.toISOString(),
    receivedAt: new Date().toISOString(),
    smsSent: false,
    ...(status ? { status } : {}),
    ...(battery !== undefined ? { battery } : {}),
  }
}

// Demo-only seed data keeps the dashboard useful before the first ESP32 reading.
// Remove this block for a real deployment that should start with an empty history.
function seedDemoReadings() {
  const demoLocation = { lat: 14.5995, lng: 120.9842 }
  const samples = [
    { level: 1, hoursAgo: 48, latOffset: 0.0008, lngOffset: -0.0006 },
    { level: 0, hoursAgo: 40, latOffset: 0.0005, lngOffset: -0.0002 },
    { level: 2, hoursAgo: 32, latOffset: 0.0002, lngOffset: 0.0003 },
    { level: 3, hoursAgo: 26, latOffset: -0.0003, lngOffset: 0.0006 },
    { level: 4, hoursAgo: 20, latOffset: -0.0005, lngOffset: 0.0004 },
    { level: 3, hoursAgo: 14, latOffset: -0.0002, lngOffset: 0.0001 },
    { level: 2, hoursAgo: 8, latOffset: 0.0001, lngOffset: -0.0003 },
    { level: 3, hoursAgo: 4, latOffset: 0.0004, lngOffset: -0.0005 },
    { level: 2, hoursAgo: 2, latOffset: 0.0006, lngOffset: -0.0002 },
    { level: 3, hoursAgo: 0.08, latOffset: 0.0007, lngOffset: 0.0001 },
  ]

  for (const sample of samples) {
    const timestamp = new Date(Date.now() - sample.hoursAgo * 60 * 60 * 1000)
    readings.push({
      id: `reading-${nextReadingId++}`,
      level: sample.level,
      lat: demoLocation.lat + sample.latOffset,
      lng: demoLocation.lng + sample.lngOffset,
      timestamp: timestamp.toISOString(),
      receivedAt: timestamp.toISOString(),
      smsSent: sample.level >= 3,
    })
  }
}

seedDemoReadings()

app.post('/api/readings', (request, response) => {
  try {
    const reading = parseReading(request.body)
    readings.push(reading)
    io.emit('reading:new', reading)
    response.status(201).json(reading)
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid reading' })
  }
})

app.get('/api/readings/latest', (_request, response) => {
  response.json(readings.at(-1) ?? null)
})

app.get('/api/readings/history', (_request, response) => {
  response.json(readings.slice().reverse())
})

app.get('/api/device/status', (_request, response) => {
  response.json(getDeviceStatus())
})

app.get('/health', (_request, response) => {
  response.json({ ok: true })
})

const distDirectory = path.resolve(process.cwd(), 'dist')
app.use(express.static(distDirectory))
app.use((request, response, next) => {
  if (
    request.method === 'GET' &&
    !request.path.startsWith('/api/') &&
    request.path !== '/health' &&
    !request.path.startsWith('/socket.io/')
  ) {
    response.sendFile(path.join(distDirectory, 'index.html'))
    return
  }
  next()
})

io.on('connection', (socket) => {
  socket.emit('device:status', getDeviceStatus())
})

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`FLOOD_ALERT backend listening on port ${PORT}`)
})