import type { FloodData, FloodLevel, Thresholds } from '../types'

const now = Date.now()
const minutesAgo = (minutes: number) => new Date(now - minutes * 60_000).toISOString()

export const FLOOD_LEVELS: Record<FloodLevel, FloodStatusShape> = {
  0: {
    label: 'No water detected',
    shortLabel: 'None',
    color: '#64748b',
    softColor: '#0f1b2d',
    textColor: '#cbd5e1',
    iconColor: '#64748b',
  },
  1: {
    label: 'Safe',
    shortLabel: 'Safe',
    color: '#16a34a',
    softColor: '#06251d',
    textColor: '#86efac',
    iconColor: '#16a34a',
  },
  2: {
    label: 'Normal',
    shortLabel: 'Normal',
    color: '#2563eb',
    softColor: '#0b1d3a',
    textColor: '#93c5fd',
    iconColor: '#2563eb',
  },
  3: {
    label: 'Flooding possible',
    shortLabel: 'Possible',
    color: '#d97706',
    softColor: '#2a1b06',
    textColor: '#fbbf24',
    iconColor: '#d97706',
  },
  4: {
    label: 'Severe flooding',
    shortLabel: 'Severe',
    color: '#dc2626',
    softColor: '#2b0d13',
    textColor: '#fca5a5',
    iconColor: '#dc2626',
  },
}

type FloodStatusShape = {
  label: string
  shortLabel: string
  color: string
  softColor: string
  textColor: string
  iconColor: string
}

const chartPattern: FloodLevel[] = [1, 1, 1, 2, 1, 2, 2, 2, 2, 1, 2, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 3, 3]

export const mockFloodData: FloodData = {
  currentLevel: 3,
  lastReadingAt: minutesAgo(1),
  lastLevelChangeAt: minutesAgo(21),
  deviceOnline: true,
  deviceLastSeenAt: minutesAgo(1),
  location: {
    lat: 14.5995,
    lng: 120.9842,
  },
  history: [
    { id: 'reading-1', level: 3, timestamp: minutesAgo(1), smsSent: true },
    { id: 'reading-2', level: 3, timestamp: minutesAgo(6), smsSent: false },
    { id: 'reading-3', level: 3, timestamp: minutesAgo(11), smsSent: false },
    { id: 'reading-4', level: 2, timestamp: minutesAgo(21), smsSent: false },
    { id: 'reading-5', level: 2, timestamp: minutesAgo(26), smsSent: false },
    { id: 'reading-6', level: 2, timestamp: minutesAgo(36), smsSent: false },
    { id: 'reading-7', level: 1, timestamp: minutesAgo(51), smsSent: false },
    { id: 'reading-8', level: 1, timestamp: minutesAgo(66), smsSent: false },
  ],
  levelReadings: chartPattern.map((level, index) => ({
    level,
    timestamp: minutesAgo((chartPattern.length - index) * 5),
  })),
}

export const defaultThresholds: Thresholds = {
  sensor1: 12,
  sensor2: 24,
  sensor3: 38,
  sensor4: 54,
}