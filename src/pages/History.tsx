import { useMemo, useState } from 'react'
import { CalendarDays, Download, Filter, Smartphone } from 'lucide-react'
import { useFloodData } from '../hooks/useFloodData'
import LevelBadge from '../components/LevelBadge'
import { FLOOD_LEVELS } from '../data/mockFloodData'
import type { FloodLevel } from '../types'

const formatDate = (timestamp: string) =>
  new Intl.DateTimeFormat('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(timestamp))
const formatTime = (timestamp: string) =>
  new Intl.DateTimeFormat('en-PH', { hour: 'numeric', minute: '2-digit' }).format(new Date(timestamp))

export default function History() {
  const { data } = useFloodData()
  const [filter, setFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')

  const filtered = useMemo(() => {
    const cutoff = filter === 'today' ? Date.now() - 24 * 60 * 60_000 : filter === 'week' ? Date.now() - 7 * 24 * 60 * 60_000 : 0
    return data.history.filter((item) => new Date(item.timestamp).getTime() >= cutoff && (levelFilter === 'all' || item.level === Number(levelFilter)))
  }, [data.history, filter, levelFilter])

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400"><CalendarDays size={14} /> Activity log</div>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Reading history</h1>
        <p className="mt-1 text-sm text-slate-500">A complete chronological record of water-level readings and alerts.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Filter size={15} className="text-slate-400" /> Filter readings</div>
        <div className="flex flex-wrap gap-2">
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
            <option value="all">All dates</option>
            <option value="today">Last 24 hours</option>
            <option value="week">Last 7 days</option>
          </select>
          <select value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
            <option value="all">All levels</option>
            {([0, 1, 2, 3, 4] as FloodLevel[]).map((level) => <option value={level} key={level}>{FLOOD_LEVELS[level].label}</option>)}
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-950"><Download size={14} /> Export</button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="hidden grid-cols-[1.2fr_1.1fr_1fr_1fr] gap-4 border-b border-slate-100 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 md:grid">
          <span>Date</span><span>Water level</span><span>Alert status</span><span>Notification</span>
        </div>
        <div className="divide-y divide-slate-100">
          {filtered.map((reading) => (
            <div key={reading.id} className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 sm:px-6 md:grid-cols-[1.2fr_1.1fr_1fr_1fr] md:items-center md:gap-4">
              <div>
                <p className="text-xs font-bold text-slate-800">{formatDate(reading.timestamp)}</p>
                <p className="mt-1 text-[11px] text-slate-400">{formatTime(reading.timestamp)}</p>
              </div>
              <div><LevelBadge level={reading.level} /></div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: FLOOD_LEVELS[reading.level].color }} />
                {reading.level >= 3 ? 'Review recommended' : 'Within threshold'}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                {reading.smsSent ? <><span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Smartphone size={13} /></span><span className="text-emerald-700">SMS sent</span></> : <span className="text-slate-400">No notification</span>}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="px-6 py-12 text-center text-sm text-slate-500">No readings match these filters.</div>}
        <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs font-semibold text-slate-500">{filtered.length} readings shown</div>
      </section>
    </div>
  )
}