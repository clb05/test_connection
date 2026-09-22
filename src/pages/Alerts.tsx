import { useState } from 'react'
import { AlertTriangle, MessageSquare, Users, Shield, Send, CheckCircle, Clock } from 'lucide-react'

const alertHistory = [
  { id: 1, level: '2ND WARNING', msg: '2nd Warning: Water level at 138 cm. Prepare for flooding.', time: '16:01 PHT', recipient: 'LGU + Barangay Officials', status: 'Delivered', color: 'orange' },
  { id: 2, level: '1ST WARNING', msg: '1st Warning: Water level rising — 95 cm. Continue monitoring.', time: '13:45 PHT', recipient: 'Disaster Response Team', status: 'Delivered', color: 'yellow' },
  { id: 3, level: '1ST WARNING', msg: '1st Warning: Rising water level detected at Sensor 2.', time: '12:30 PHT', recipient: 'Barangay Officials', status: 'Delivered', color: 'yellow' },
  { id: 4, level: 'NORMAL', msg: 'System check: All sensors nominal. No immediate threat.', time: '08:00 PHT', recipient: 'All Recipients', status: 'Delivered', color: 'emerald' },
]

const colorMap: Record<string, string> = {
  orange: 'border-orange-500/30 bg-orange-500/5 text-orange-400',
  yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
  red: 'border-red-500/30 bg-red-500/5 text-red-400',
  emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
}

export default function Alerts() {
  const [sent, setSent] = useState<string[]>([])

  const sendAlert = (key: string) => setSent(s => [...s, key])

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Alerts & Warnings</h2>

      {/* Warning level status row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { level: 'Normal', desc: 'No immediate threat.', color: 'emerald', icon: Shield, active: false },
          { level: '1st Warning', desc: 'Water level is increasing.', color: 'yellow', icon: AlertTriangle, active: false },
          { level: '2nd Warning', desc: 'Dangerous level detected.', color: 'orange', icon: AlertTriangle, active: true },
          { level: 'Critical Warning', desc: 'Immediate response required.', color: 'red', icon: AlertTriangle, active: false },
        ].map(w => {
          const Icon = w.icon
          return (
            <div key={w.level} className={`rounded-xl border p-4 ${w.active ? colorMap[w.color] + ' shadow-lg' : 'border-white/10 bg-white/2'}`}>
              <Icon size={16} className={w.active ? '' : 'text-slate-500'} />
              <div className={`text-sm font-bold mt-2 ${w.active ? '' : 'text-slate-500'}`}>{w.level}</div>
              <div className={`text-[11px] mt-0.5 ${w.active ? 'opacity-80' : 'text-slate-600'}`}>{w.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Action buttons */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><Send size={14} className="text-cyan-400" /> Send Alerts</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'sms', icon: MessageSquare, label: 'Send SMS Alert', color: 'cyan' },
            { key: 'warning', icon: AlertTriangle, label: 'Issue Warning', color: 'orange' },
            { key: 'lgu', icon: Users, label: 'Notify LGU', color: 'teal' },
            { key: 'drrm', icon: Shield, label: 'Notify DRRM Team', color: 'red' },
          ].map(btn => {
            const Icon = btn.icon
            const isSent = sent.includes(btn.key)
            const colorCls: Record<string, string> = {
              cyan: 'border-cyan-400/30 hover:border-cyan-400/60 hover:bg-cyan-400/10 text-cyan-400',
              orange: 'border-orange-400/30 hover:border-orange-400/60 hover:bg-orange-400/10 text-orange-400',
              teal: 'border-teal-400/30 hover:border-teal-400/60 hover:bg-teal-400/10 text-teal-400',
              red: 'border-red-400/30 hover:border-red-400/60 hover:bg-red-400/10 text-red-400',
            }
            return (
              <button
                key={btn.key}
                onClick={() => sendAlert(btn.key)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${isSent ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' : colorCls[btn.color]}`}
              >
                {isSent ? <CheckCircle size={14} /> : <Icon size={14} />}
                {isSent ? 'Sent!' : btn.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Alert history */}
      <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2"><Clock size={14} className="text-cyan-400" /> Alert History — Sep 21, 2026</h3>
        <div className="space-y-3">
          {alertHistory.map(a => (
            <div key={a.id} className={`flex items-start gap-4 p-4 rounded-lg border ${colorMap[a.color]}`}>
              <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold tracking-wider">{a.level}</span>
                  <span className="text-[11px] opacity-70">{a.time}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{a.msg}</p>
                <div className="text-[10px] text-slate-500 mt-1">{a.recipient}</div>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 flex-shrink-0">
                <CheckCircle size={11} /> {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
