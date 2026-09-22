import { TrendingUp, AlertTriangle, Clock, Activity } from 'lucide-react'
import {
  ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

const data = [
  { time: '10:00', actual: 72, rainfall: 8 },
  { time: '11:00', actual: 90, rainfall: 12 },
  { time: '12:00', actual: 105, rainfall: 18 },
  { time: '13:00', actual: 120, rainfall: 22 },
  { time: '14:00', actual: 128, rainfall: 20 },
  { time: '15:00', actual: 135, rainfall: 24 },
  { time: '16:00', actual: 138, rainfall: 25 },
  { time: '17:00', forecast: 142, rainfall: 26 },
  { time: '18:00', forecast: 150, rainfall: 28 },
  { time: '19:00', forecast: 158, rainfall: 24 },
  { time: '20:00', forecast: 165, rainfall: 20 },
  { time: '21:00', forecast: 170, rainfall: 16 },
  { time: '22:00', forecast: 168, rainfall: 12 },
]

export default function Forecasting() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Flood Forecasting</h2>
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Activity size={12} className="animate-pulse" />
          <span className="font-mono">Model updating…</span>
        </div>
      </div>

      {/* Prediction card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a1a30] border border-red-500/30 p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5 pointer-events-none" />
        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Flood Risk Prediction</div>
            <div className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <AlertTriangle size={16} /> High Risk
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Current Level</div>
            <div className="text-xl font-bold text-orange-400">2nd Warning</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Forecast Period</div>
            <div className="text-xl font-bold text-white flex items-center gap-2"><Clock size={15} /> Next 6 Hours</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-mono">Risk Probability</div>
            <div className="text-xl font-bold text-red-400">78%</div>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-[11px] text-slate-400 mb-0.5">Predicted Peak Level</div>
            <div className="text-lg font-bold font-mono text-red-400">170 cm</div>
            <div className="text-[11px] text-slate-500">at ~21:00 PHT</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-[11px] text-slate-400 mb-0.5">Prediction Confidence</div>
            <div className="text-lg font-bold font-mono text-cyan-400">84%</div>
            <div className="text-[11px] text-slate-500">LSTM Model v2.1</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2"><TrendingUp size={14} className="text-cyan-400" /> Water Level Forecast</h3>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-cyan-400 inline-block rounded" /> Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block rounded border-dashed border-t" /> Forecast</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-400/30 inline-block rounded-sm" /> Rainfall</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="fg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fg2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0e2444" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit=" cm" />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit=" mm" />
            <Tooltip contentStyle={{ background: '#071222', border: '1px solid #0e2444', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} />
            <ReferenceLine yAxisId="left" y={150} stroke="#f97316" strokeDasharray="4 2" strokeWidth={1} label={{ value: '2nd Warn', fill: '#f97316', fontSize: 9 }} />
            <ReferenceLine yAxisId="left" y={100} stroke="#eab308" strokeDasharray="4 2" strokeWidth={1} label={{ value: '1st Warn', fill: '#eab308', fontSize: 9 }} />
            <Bar yAxisId="right" dataKey="rainfall" fill="#3b82f6" fillOpacity={0.3} name="Rainfall (mm)" />
            <Area yAxisId="left" type="monotone" dataKey="actual" stroke="#22d3ee" strokeWidth={2} fill="url(#fg1)" name="Actual Level (cm)" connectNulls={false} />
            <Area yAxisId="left" type="monotone" dataKey="forecast" stroke="#ef4444" strokeWidth={2} fill="url(#fg2)" strokeDasharray="5 3" name="Forecast Level (cm)" connectNulls={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly breakdown */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">6-Hour Forecast Breakdown</h3>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { time: '17:00', level: 142, risk: 'orange' },
            { time: '18:00', level: 150, risk: 'orange' },
            { time: '19:00', level: 158, risk: 'red' },
            { time: '20:00', level: 165, risk: 'red' },
            { time: '21:00', level: 170, risk: 'red' },
            { time: '22:00', level: 168, risk: 'red' },
          ].map(h => (
            <div key={h.time} className={`rounded-lg p-3 border text-center ${h.risk === 'red' ? 'border-red-500/30 bg-red-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
              <div className="text-[11px] text-slate-400 font-mono mb-1">{h.time}</div>
              <div className={`text-base font-bold font-mono ${h.risk === 'red' ? 'text-red-400' : 'text-orange-400'}`}>{h.level}</div>
              <div className="text-[10px] text-slate-500">cm</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
