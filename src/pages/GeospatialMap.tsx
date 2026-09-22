import { useState } from 'react'
import { MapPin, Waves, AlertTriangle, X } from 'lucide-react'

const zones = [
  { id: 'z1', label: 'Normal Zone', color: '#22c55e', opacity: 0.15, cx: 200, cy: 320, rx: 70, ry: 45 },
  { id: 'z2', label: '1st Warning Zone', color: '#eab308', opacity: 0.18, cx: 280, cy: 250, rx: 65, ry: 50 },
  { id: 'z3', label: '2nd Warning Zone', color: '#f97316', opacity: 0.20, cx: 360, cy: 190, rx: 70, ry: 55 },
  { id: 'z4', label: 'Critical Zone', color: '#ef4444', opacity: 0.22, cx: 450, cy: 140, rx: 65, ry: 45 },
]

const sensorPoints = [
  { id: 1, label: 'Sensor 1 — Normal',           x: 185, y: 325, color: '#22c55e', level: 'NORMAL',           wl: 42  },
  { id: 2, label: 'Sensor 2 — 1st Warning',       x: 280, y: 248, color: '#eab308', level: '1ST WARNING',      wl: 95  },
  { id: 3, label: 'Sensor 3 — 2nd Warning',       x: 365, y: 192, color: '#f97316', level: '2ND WARNING',      wl: 138 },
  { id: 4, label: 'Sensor 4 — Critical Warning',  x: 452, y: 142, color: '#ef4444', level: 'CRITICAL WARNING', wl: 181 },
]

const station = { x: 320, y: 230 }

export default function GeospatialMap() {
  const [popup, setPopup] = useState<number | null>(null)
  const [stationPopup, setStationPopup] = useState(false)

  const activeSensor = sensorPoints.find(s => s.id === popup)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Geospatial Flood Map</h2>
        <div className="text-xs text-slate-400 font-mono">Sitio Tagbakin · Barangay Halang · Lipa City, Batangas</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map SVG */}
        <div className="lg:col-span-3 bg-[#0a1a30] border border-cyan-900/30 rounded-xl overflow-hidden relative">
          <svg width="100%" viewBox="0 0 640 420" className="block">
            {/* Base terrain */}
            <rect width="640" height="420" fill="#071222" />
            {/* Grid */}
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={420} stroke="#0e2444" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 50} x2={640} y2={i * 50} stroke="#0e2444" strokeWidth={0.5} />
            ))}

            {/* Terrain patches */}
            <ellipse cx="150" cy="350" rx="110" ry="60" fill="#0d2a1c" opacity={0.6} />
            <ellipse cx="500" cy="320" rx="90" ry="55" fill="#0d2a1c" opacity={0.5} />
            <ellipse cx="80" cy="180" rx="80" ry="50" fill="#0d2a1c" opacity={0.4} />

            {/* Risk zones */}
            {zones.map(z => (
              <ellipse key={z.id} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                fill={z.color} opacity={z.opacity} stroke={z.color} strokeWidth={1} strokeOpacity={0.4} />
            ))}

            {/* River / waterway */}
            <path d="M 100 380 Q 200 340 280 270 Q 360 210 450 160 Q 520 120 590 90"
              stroke="#22d3ee" strokeWidth={6} fill="none" opacity={0.25} />
            <path d="M 100 380 Q 200 340 280 270 Q 360 210 450 160 Q 520 120 590 90"
              stroke="#22d3ee" strokeWidth={2} fill="none" opacity={0.6} strokeDasharray="8 4" />

            {/* Community areas */}
            <rect x="130" y="290" width="60" height="40" rx="4" fill="#0e2444" stroke="#22d3ee" strokeWidth={0.5} strokeOpacity={0.4} />
            <rect x="490" y="270" width="55" height="38" rx="4" fill="#0e2444" stroke="#22d3ee" strokeWidth={0.5} strokeOpacity={0.4} />
            <text x="160" y="316" fill="#64748b" fontSize={8} textAnchor="middle">Community A</text>
            <text x="517" y="295" fill="#64748b" fontSize={8} textAnchor="middle">Community B</text>

            {/* Monitoring station */}
            <circle cx={station.x} cy={station.y} r={14} fill="#0a1a30" stroke="#22d3ee" strokeWidth={2} />
            <circle cx={station.x} cy={station.y} r={5} fill="#22d3ee" />
            <circle cx={station.x} cy={station.y} r={20} fill="none" stroke="#22d3ee" strokeWidth={1} strokeOpacity={0.3} strokeDasharray="4 3" />
            <text x={station.x} y={station.y + 28} fill="#22d3ee" fontSize={9} textAnchor="middle" fontWeight="600">MONITORING STN</text>
            <rect x={station.x - 42} y={station.y + 32} width={84} height={13} rx={2} fill="#071222" opacity={0.8} />
            <text x={station.x} y={station.y + 41} fill="#64748b" fontSize={7.5} textAnchor="middle">ID: TBK-LS-001</text>
            <g onClick={() => setStationPopup(true)} style={{ cursor: 'pointer' }}>
              <circle cx={station.x} cy={station.y} r={20} fill="transparent" />
            </g>

            {/* Sensor points */}
            {sensorPoints.map(s => (
              <g key={s.id} onClick={() => setPopup(s.id)} style={{ cursor: 'pointer' }}>
                <circle cx={s.x} cy={s.y} r={18} fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={1.5} strokeOpacity={0.5} />
                <circle cx={s.x} cy={s.y} r={7} fill={s.color} />
                <circle cx={s.x} cy={s.y} r={11} fill="none" stroke={s.color} strokeWidth={1} strokeOpacity={0.4} />
                <text x={s.x} y={s.y - 23} fill={s.color} fontSize={9} textAnchor="middle" fontWeight="700">WS-{s.id}</text>
              </g>
            ))}

            {/* Legend */}
            <rect x="10" y="10" width="150" height="90" rx="6" fill="#071222" opacity={0.9} stroke="#0e2444" strokeWidth={1} />
            <text x="20" y="27" fill="#94a3b8" fontSize={9} fontWeight="600">FLOOD RISK ZONES</text>
            {zones.map((z, i) => (
              <g key={z.id}>
                <circle cx={22} cy={38 + i * 16} r={4} fill={z.color} />
                <text x={32} y={42 + i * 16} fill="#94a3b8" fontSize={8.5}>{z.label}</text>
              </g>
            ))}

            {/* Scale bar */}
            <line x1="480" y1="405" x2="560" y2="405" stroke="#64748b" strokeWidth={1.5} />
            <line x1="480" y1="400" x2="480" y2="410" stroke="#64748b" strokeWidth={1.5} />
            <line x1="560" y1="400" x2="560" y2="410" stroke="#64748b" strokeWidth={1.5} />
            <text x="520" y="416" fill="#64748b" fontSize={8} textAnchor="middle">~500 m</text>
          </svg>

          {/* Sensor popup */}
          {activeSensor && (
            <div className="absolute top-4 right-4 bg-[#071222] border border-cyan-900/50 rounded-xl p-4 w-56 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-300">Water Sensor {activeSensor.id}</span>
                <button onClick={() => setPopup(null)} className="text-slate-500 hover:text-slate-300"><X size={13} /></button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Station ID</span><span className="font-mono text-slate-200">TBK-WS-00{activeSensor.id}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Water Level</span><span className="font-mono text-white">{activeSensor.wl} cm</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Warning Level</span><span className="font-bold" style={{ color: activeSensor.color }}>{activeSensor.level}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Rainfall</span><span className="font-mono text-slate-200">24.6 mm/hr</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Sensor</span><span className="text-emerald-400">Online</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Last Update</span><span className="font-mono text-slate-400">16:02 PHT</span></div>
              </div>
            </div>
          )}

          {/* Station popup */}
          {stationPopup && (
            <div className="absolute top-4 right-4 bg-[#071222] border border-cyan-400/30 rounded-xl p-4 w-56 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-cyan-300">Monitoring Station</span>
                <button onClick={() => setStationPopup(false)} className="text-slate-500 hover:text-slate-300"><X size={13} /></button>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Station ID</span><span className="font-mono text-slate-200">TBK-LS-001</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Water Level</span><span className="font-mono text-orange-400">138 cm</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Warning</span><span className="font-bold text-orange-400">2ND WARNING</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Rainfall</span><span className="font-mono text-slate-200">24.6 mm/hr</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Sensors</span><span className="text-emerald-400">4/4 Online</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Last Update</span><span className="font-mono text-slate-400">16:02 PHT</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Side legend */}
        <div className="space-y-4">
          <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2"><Waves size={12} className="text-cyan-400" /> Sensor Points</h4>
            <div className="space-y-2">
              {sensorPoints.map(s => (
                <button key={s.id} onClick={() => setPopup(s.id)}
                  className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <div>
                    <div className="text-[11px] text-slate-300">WS-{s.id}</div>
                    <div className="text-[10px]" style={{ color: s.color }}>{s.level}</div>
                  </div>
                  <span className="ml-auto text-[11px] font-mono text-slate-400">{s.wl} cm</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2"><MapPin size={12} className="text-cyan-400" /> Current Alert</h4>
            <div className="flex items-center gap-2 p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <AlertTriangle size={14} className="text-orange-400 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-orange-400">2nd Warning</div>
                <div className="text-[10px] text-slate-400">Dangerous level</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
