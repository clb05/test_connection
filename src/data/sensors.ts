export type WarningLevel = 'NORMAL' | '1ST WARNING' | '2ND WARNING' | 'CRITICAL WARNING'

export interface Sensor {
  id: number
  label: string
  level: WarningLevel
  waterLevel: number   // cm
  maxLevel: number     // cm
  description: string
}

export const sensors: Sensor[] = [
  {
    id: 1,
    label: 'Water Sensor 1',
    level: 'NORMAL',
    waterLevel: 42,
    maxLevel: 200,
    description: 'Water level is within the safe range.',
  },
  {
    id: 2,
    label: 'Water Sensor 2',
    level: '1ST WARNING',
    waterLevel: 95,
    maxLevel: 200,
    description: 'Water level is increasing. Continue monitoring.',
  },
  {
    id: 3,
    label: 'Water Sensor 3',
    level: '2ND WARNING',
    waterLevel: 138,
    maxLevel: 200,
    description: 'Water level is at a dangerous level. Prepare for possible flooding.',
  },
  {
    id: 4,
    label: 'Water Sensor 4',
    level: 'CRITICAL WARNING',
    waterLevel: 181,
    maxLevel: 200,
    description: 'Critical water level detected. Immediate emergency response required.',
  },
]

export const warningColors: Record<WarningLevel, { bg: string; text: string; border: string; fill: string; led: string }> = {
  'NORMAL':           { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', fill: '#22c55e', led: '#22c55e' },
  '1ST WARNING':      { bg: 'bg-yellow-500/10',  text: 'text-yellow-400',  border: 'border-yellow-500/30',  fill: '#eab308', led: '#eab308' },
  '2ND WARNING':      { bg: 'bg-orange-500/10',  text: 'text-orange-400',  border: 'border-orange-500/30',  fill: '#f97316', led: '#f97316' },
  'CRITICAL WARNING': { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/30',     fill: '#ef4444', led: '#ef4444' },
}
