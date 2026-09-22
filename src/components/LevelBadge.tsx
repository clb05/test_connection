import { FLOOD_LEVELS } from '../data/mockFloodData'
import type { FloodLevel } from '../types'

export default function LevelBadge({ level, compact = false }: { level: FloodLevel; compact?: boolean }) {
  const status = FLOOD_LEVELS[level]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold ${compact ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'}`}
      style={{ backgroundColor: status.softColor, color: status.textColor }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
      {status.label}
    </span>
  )
}