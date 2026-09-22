import { useState } from 'react'
import { FileText, Download, Calendar, CheckCircle } from 'lucide-react'

const reportTypes = [
  { id: 'daily', label: 'Daily Monitoring Report', desc: 'Sensor readings and warnings for today', icon: '📊' },
  { id: 'weekly', label: 'Weekly Flood Report', desc: 'Weekly summary of flood events and levels', icon: '📈' },
  { id: 'monthly', label: 'Monthly Flood Report', desc: 'Monthly analysis and trend data', icon: '🗓️' },
  { id: 'sensor', label: 'Sensor Performance Report', desc: 'Hardware uptime and sensor accuracy', icon: '⚙️' },
  { id: 'warning', label: 'Warning History Report', desc: 'Complete log of all warnings issued', icon: '⚠️' },
  { id: 'accuracy', label: 'Prediction Accuracy Report', desc: 'Flood forecast vs actual comparison', icon: '🎯' },
]

export default function Reports() {
  const [selected, setSelected] = useState('daily')
  const [generated, setGenerated] = useState(false)

  const selectedReport = reportTypes.find(r => r.id === selected)!

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-white">Reports</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report selector */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-3 font-mono">Report Type</div>
          {reportTypes.map(r => (
            <button key={r.id} onClick={() => { setSelected(r.id); setGenerated(false) }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${selected === r.id ? 'border-cyan-400/30 bg-cyan-400/5 text-white' : 'border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'}`}>
              <span className="text-base">{r.icon}</span>
              <div className="min-w-0">
                <div className="text-sm font-medium leading-tight">{r.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{r.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Report preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0a1a30] border border-cyan-900/30 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedReport.label}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <Calendar size={11} /> Sep 21, 2026 · Sitio Tagbakin, Lipa City, Batangas
                </div>
              </div>
              <button
                onClick={() => setGenerated(true)}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#071222] rounded-lg text-xs font-bold transition-all"
              >
                <FileText size={13} /> Generate Report
              </button>
            </div>

            {generated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs">
                  <CheckCircle size={13} /> Report generated successfully
                </div>

                {/* Mock report preview */}
                <div className="bg-white rounded-lg p-6 text-[#071222] text-xs leading-relaxed font-mono">
                  <div className="text-center mb-4">
                    <div className="text-base font-bold">T.U.B.I.G. FLOOD MONITORING SYSTEM</div>
                    <div className="text-sm font-semibold">{selectedReport.label.toUpperCase()}</div>
                    <div className="text-[11px] text-gray-500 mt-1">Sitio Tagbakin, Barangay Halang, Lipa City, Batangas, Philippines</div>
                    <div className="text-[11px] text-gray-400">Generated: September 21, 2026 · 16:05:12 PHT</div>
                    <hr className="my-3 border-gray-300" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><span className="font-semibold">Station ID:</span> TBK-LS-001</div>
                    <div><span className="font-semibold">Monitoring Period:</span> 08:00–16:05</div>
                    <div><span className="font-semibold">Peak Water Level:</span> 138 cm</div>
                    <div><span className="font-semibold">Warnings Issued:</span> 2</div>
                    <div><span className="font-semibold">Max Rainfall:</span> 24.6 mm/hr</div>
                    <div><span className="font-semibold">Avg Temperature:</span> 28.4 °C</div>
                  </div>
                  <hr className="my-3 border-gray-200" />
                  <div className="mb-2 font-semibold">Warning Summary</div>
                  <div className="text-gray-600 mb-1">13:45 PHT — 1st Warning issued. Water level: 95 cm</div>
                  <div className="text-gray-600 mb-1">16:01 PHT — 2nd Warning issued. Water level: 138 cm</div>
                  <hr className="my-3 border-gray-200" />
                  <div className="text-center text-gray-400 text-[10px]">
                    Prepared by: T.U.B.I.G. Automated Reporting System · BSCS Thesis Prototype
                  </div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 border border-cyan-400/30 text-cyan-400 rounded-lg text-xs font-medium hover:bg-cyan-400/10 transition-all">
                  <Download size={13} /> Download PDF
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText size={32} className="text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">Select a report type and click</p>
                <p className="text-slate-500 text-xs mt-1">"Generate Report" to preview and download</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
