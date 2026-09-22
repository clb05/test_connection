import http from 'node:http'
import path from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import pg from 'pg'
import { Server as SocketIOServer } from 'socket.io'

const PORT = Number.parseInt(process.env.PORT ?? '3001', 10)
const TEN_MINUTES = 10 * 60 * 1000
const RETENTION_HOURS = Number.parseInt(process.env.READING_RETENTION_HOURS ?? '48', 10)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? '*'
const ENABLE_DEMO_DATA = process.env.ENABLE_DEMO_DATA === 'true'
const DEVICE_API_KEY = process.env.DEVICE_API_KEY ?? ''
const { Pool } = pg

const app = express()
const httpServer = http.createServer(app)
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: FRONTEND_ORIGIN,
  },
})

app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(express.json({ limit: '32kb' }))

function serializeReading(row) {
  return {
    id: `reading-${row.id}`,
    level: row.level,
    lat: row.lat,
    lng: row.lng,
    timestamp: new Date(row.timestamp).toISOString(),
    receivedAt: new Date(row.received_at).toISOString(),
    smsSent: Boolean(row.sms_sent),
    ...(row.status ? { status: row.status } : {}),
    ...(row.battery == null ? {} : { battery: Number(row.battery) }),
  }
}

async function getLatestReading() {
  const result = await pool.query(`
    SELECT id, level, lat, lng, timestamp, received_at, sms_sent, status, battery
    FROM flood_readings
    ORDER BY received_at DESC, id DESC
    LIMIT 1
  `)
  return result.rows[0] ? serializeReading(result.rows[0]) : null
}

async function getDeviceStatus() {
  const latest = await getLatestReading()
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
    level,
    lat,
    lng,
    timestamp: timestamp.toISOString(),
    ...(status ? { status } : {}),
    ...(battery !== undefined ? { battery } : {}),
  }
}

function hasValidDeviceApiKey(request) {
  if (!DEVICE_API_KEY) return false
  const provided = request.get('x-api-key') ?? ''
  const expectedBuffer = Buffer.from(DEVICE_API_KEY)
  const providedBuffer = Buffer.from(provided)
  return expectedBuffer.length === providedBuffer.length && timingSafeEqual(expectedBuffer, providedBuffer)
}

function requireDeviceApiKey(request, response, next) {
  if (!DEVICE_API_KEY) {
    response.status(503).json({ error: 'Device API key is not configured' })
    return
  }
  if (!hasValidDeviceApiKey(request)) {
    response.status(401).json({ error: 'Missing or invalid device API key' })
    return
  }
  next()
}

async function storeReading(reading) {
  const result = await pool.query(
    `
      INSERT INTO flood_readings (level, lat, lng, timestamp, status, battery)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, level, lat, lng, timestamp, received_at, sms_sent, status, battery
    `,
    [reading.level, reading.lat, reading.lng, reading.timestamp, reading.status ?? null, reading.battery ?? null],
  )
  await pool.query('DELETE FROM flood_readings WHERE received_at < NOW() - ($1 * INTERVAL \'1 hour\')', [RETENTION_HOURS])
  return serializeReading(result.rows[0])
}

app.post('/api/readings', requireDeviceApiKey, async (request, response) => {
  try {
    const reading = await storeReading(parseReading(request.body))
    io.emit('reading:new', reading)
    response.status(201).json(reading)
  } catch (error) {
    response.status(400).json({ error: error instanceof Error ? error.message : 'Invalid reading' })
  }
})

app.get('/api/readings/latest', async (_request, response) => {
  try {
    response.json(await getLatestReading())
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Unable to load latest reading' })
  }
})

app.get('/api/readings/history', async (_request, response) => {
  try {
    const result = await pool.query(
      `
        SELECT id, level, lat, lng, timestamp, received_at, sms_sent, status, battery
        FROM flood_readings
        WHERE received_at >= NOW() - ($1 * INTERVAL '1 hour')
        ORDER BY received_at DESC, id DESC
        LIMIT 1000
      `,
      [RETENTION_HOURS],
    )
    response.json(result.rows.map(serializeReading))
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Unable to load reading history' })
  }
})

app.get('/api/device/status', async (_request, response) => {
  try {
    response.json(await getDeviceStatus())
  } catch (error) {
    response.status(500).json({ error: error instanceof Error ? error.message : 'Unable to load device status' })
  }
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
  getDeviceStatus()
    .then((status) => socket.emit('device:status', status))
    .catch(() => socket.emit('device:status', { online: false, lastSeenAt: null, status: null, battery: null }))
})

async function start() {
  if (!Number.isInteger(RETENTION_HOURS) || RETENTION_HOURS < 24) {
    throw new Error('READING_RETENTION_HOURS must be an integer of at least 24')
  }
  await pool.query('SELECT 1')
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`FLOOD_ALERT backend listening on port ${PORT}`)
  })
}

start().catch((error) => {
  console.error('FLOOD_ALERT backend failed to start:', error)
  process.exitCode = 1
})