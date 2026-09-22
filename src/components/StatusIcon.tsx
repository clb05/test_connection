import { AlertTriangle, CheckCircle2, Droplets, Waves } from 'lucide-react'
import type { FloodLevel } from '../types'

export function StatusIcon({ level, size = 36 }: { level: FloodLevel; size?: number }) {
  const Icon = level === 0 ? Droplets : level === 1 ? CheckCircle2 : level === 2 ? Waves : AlertTriangle
  return <Icon size={size} strokeWidth={2.4} aria-hidden="true" />
}