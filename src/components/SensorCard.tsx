import type { Sensor } from '../data/sensors'
import { warningColors } from '../data/sensors'
import { Droplets } from 'lucide-react'

interface Props {
  sensor: Sensor
  compact?: boolean
}

export default function SensorCard({ sensor, compact }: Props) {
  const c = warningColors[sensor.level]
  const pct = (sensor.waterLevel / sensor.maxLevel) * 100

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-4 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplets size={15} className={c.text} />
          <span className="text-sm font-semibold text-slate-200">{sensor.label}</span>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.border} ${c.text} tracking-wider`}>
          {sensor.level}
        </span>
      </div>

      {/* Water fill visualization */}
      <div className="relative h-24 rounded-lg bg-[#071222]/60 border border-white/5 overflow-hidden">
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-b-lg"
          style={{ height: `${pct}%`, background: `${c.fill}30` }}
        />
        {/* Wave line */}
        <div
          className="absolute left-0 right-0 h-0.5 transition-all duration-500"
          style={{ bottom: `${pct}%`, background: c.fill, boxShadow: `0 0 8px ${c.fill}` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold font-mono ${c.text}`}>{sensor.waterLevel}</span>
          <span className="text-[10px] text-slate-400">cm</span>
        </div>
      </div>

      {!compact && <p className="text-[11px] text-slate-400 leading-relaxed">{sensor.description}</p>}

      {/* Fill bar */}
      <div className="h-1.5 rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: c.fill }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>0 cm</span>
        <span>{sensor.waterLevel}/{sensor.maxLevel} cm</span>
      </div>
    </div>
  )
}
