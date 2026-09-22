import { useState } from 'react'
import { BarChart3, Filter } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'

const weekly = [
  { day: 'Mon Sep 15', maxLevel: 48, avgRain: 4, events: 0 },
  { day: 'Tue Sep 16', maxLevel: 62, avgRain: 8, events: 0 },
  { day: 'Wed Sep 17', maxLevel: 105, avgRain: 18, events: 1 },
  { day: 'Thu Sep 18', maxLevel: 88, avgRain: 12, events: 0 },
  { day: 'Fri Sep 19', maxLevel: 72, avgRain: 9, events: 0 },
  { day: 'Sat Sep 20', maxLevel: 95, avgRain: 15, events: 1 },
  { day: 'Sun Sep 21', maxLevel: 138, avgRain: 25, events: 2 },
]

const tableData = [
  { date: 'Sep 21, 16:00', sensor: 'WS-3', level: 138, rain: 24.6, temp: 28.4, warning: '2ND WARNING' },
  { date: 'Sep 21, 13:00', sensor: 'WS-2', level: 95, rain: 18.2, temp: 29.1, warning: '1ST WARNING' },
  { date: 'Sep 20, 22:00', sensor: 'WS-2', level: 95, rain: 16.8, temp: 27.8, warning: '1ST WARNING' },
  { date: 'Sep 17, 15:00', sensor: 'WS-3', level: 105, rain: 22.4, temp: 27.2, warning: '2ND WARNING' },
]

const warningBadge: Record<string, string> = {
  'NORMAL':           'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  '1ST WARNING':      'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  '2ND WARNING':      'text-orange-400 border-orange-500/30 bg-orange-500/10',
  'CRITICAL WARNING': 'text-red-400 border-red-500/30 bg-red-500/10',
}

export default function HistoricalData() {
  const [range, setRange] = useState('week')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold text-white">Historical Data</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-slate-400" />
          {['day', 'week', 'month'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${range === r ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/10 text-slate-400 hover:border-white/20'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-cyan-400" /> Max Water Level (cm)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e2444" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} unit=" cm" />
              <Tooltip contentStyle={{ background: '#071222', border: '1px solid #0e2444', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} />
              <Line type="monotone" dataKey="maxLevel" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee', r: 3 }} name="Max Level (cm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Rainfall Intensity (mm/hr) & Flood Events</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0e2444" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#071222', border: '1px solid #0e2444', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
              <Bar dataKey="avgRain" fill="#3b82f6" fillOpacity={0.7} name="Rainfall (mm/hr)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="events" fill="#f97316" fillOpacity={0.8} name="Warning Events" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-cyan-900/30">
          <h3 className="text-sm font-semibold text-slate-200">Warning Event Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-900/20">
                {['Date/Time', 'Sensor', 'Water Level', 'Rainfall', 'Temperature', 'Warning Level'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/10">
              {tableData.map((row, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3 text-[12px] font-mono text-slate-300 whitespace-nowrap">{row.date}</td>
                  <td className="px-5 py-3 text-[12px] text-cyan-400 font-mono">{row.sensor}</td>
                  <td className="px-5 py-3 text-[12px] font-mono text-white">{row.level} cm</td>
                  <td className="px-5 py-3 text-[12px] font-mono text-slate-300">{row.rain} mm/hr</td>
                  <td className="px-5 py-3 text-[12px] font-mono text-slate-300">{row.temp} °C</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${warningBadge[row.warning]}`}>{row.warning}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
