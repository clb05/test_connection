import { Cpu, Wifi, MapPin, MessageSquare, Battery, Lightbulb } from 'lucide-react'
import SensorCard from '../components/SensorCard'
import { sensors, warningColors } from '../data/sensors'

function HwCard({ icon: Icon, label, status, detail }: { icon: React.ElementType; label: string; status: string; detail?: string }) {
  const ok = status === 'Online' || status === 'Connected' || status.includes('%')
  return (
    <div className="flex items-center gap-3 bg-[#071222] rounded-lg px-4 py-3 border border-cyan-900/20">
      <Icon size={15} className="text-cyan-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-400">{label}</div>
        {detail && <div className="text-[10px] text-slate-600">{detail}</div>}
      </div>
      <span className={`text-[11px] font-bold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{status}</span>
    </div>
  )
}

export default function SensorStatus() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Sensor & Hardware Status</h2>

      {/* Hardware status */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><Cpu size={14} className="text-cyan-400" /> IoT Hardware — TBK-LS-001</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <HwCard icon={Cpu} label="ESP32 Microcontroller" status="Online" detail="Firmware v3.2.1" />
          <HwCard icon={MapPin} label="GPS Module" status="Connected" detail="Fix: 3D — 8 satellites" />
          <HwCard icon={MessageSquare} label="GSM Module (SMS)" status="Connected" detail="Network: Globe Telecom" />
          <HwCard icon={Battery} label="Battery" status="74%" detail="Discharging — 8.4h remaining" />
        </div>
      </div>

      {/* LED indicators */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><Lightbulb size={14} className="text-yellow-400" /> LED Indicator Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map(s => {
            const c = warningColors[s.level]
            return (
              <div key={s.id} className={`rounded-xl border ${c.border} p-4 flex flex-col items-center gap-3`}>
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: c.fill, boxShadow: `0 0 16px ${c.fill}60, 0 0 4px ${c.fill}` }}
                >
                  <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: c.fill }} />
                </div>
                <div className="text-center">
                  <div className="text-[11px] text-slate-400">LED {s.id}</div>
                  <div className={`text-xs font-bold ${c.text}`}>{s.level}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sensor cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Wifi size={14} className="text-cyan-400" /> Water Sensor Readings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {sensors.map(s => <SensorCard key={s.id} sensor={s} />)}
        </div>
      </div>
    </div>
  )
}
