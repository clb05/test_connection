import { Droplets, CloudRain, Thermometer, Wind, RefreshCw } from 'lucide-react'
import { sensors, warningColors } from '../data/sensors'

function EnvCard({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: string; unit: string }) {
  return (
    <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} className="text-cyan-400" />
        <span className="text-[11px] text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold font-mono text-white">{value}<span className="text-sm text-slate-400 ml-1">{unit}</span></div>
    </div>
  )
}

export default function FloodMonitoring() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Flood Monitoring</h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <RefreshCw size={12} className="animate-spin" />
          <span className="font-mono">Last update: 16:02:34 PHT</span>
        </div>
      </div>

      {/* Environmental conditions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <EnvCard icon={Droplets} label="Water Level" value="138" unit="cm" />
        <EnvCard icon={CloudRain} label="Rainfall" value="24.6" unit="mm/hr" />
        <EnvCard icon={Thermometer} label="Temperature" value="28.4" unit="°C" />
        <EnvCard icon={Wind} label="Humidity" value="82" unit="%" />
      </div>

      {/* Current warning */}
      <div className="bg-[#0a1a30] border border-orange-500/30 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-mono">Current Warning Level</div>
            <div className="text-2xl font-bold text-orange-400">2nd Warning</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Station Status</div>
            <div className="text-sm font-semibold text-emerald-400">● Online</div>
          </div>
        </div>
      </div>

      {/* Sensor water-level visualizations — horizontal bars */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-6">Water Level by Sensor</h3>
        <div className="space-y-5">
          {sensors.map(s => {
            const c = warningColors[s.level]
            const pct = (s.waterLevel / s.maxLevel) * 100
            return (
              <div key={s.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.fill, boxShadow: `0 0 6px ${c.fill}` }} />
                    <span className="text-sm text-slate-300">{s.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.border} ${c.text} tracking-wider`}>{s.level}</span>
                  </div>
                  <span className={`text-sm font-bold font-mono ${c.text}`}>{s.waterLevel} cm</span>
                </div>
                <div className="relative h-4 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${c.fill}80, ${c.fill})` }}
                  />
                  {/* Threshold markers */}
                  {[30, 50, 75].map(t => (
                    <div key={t} className="absolute top-0 bottom-0 w-px bg-white/10" style={{ left: `${t}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
                  <span>0</span><span>50 cm</span><span>100 cm</span><span>150 cm</span><span>200 cm</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
