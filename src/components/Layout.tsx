import { NavLink, Outlet } from 'react-router-dom'
import {
  Activity,
  BellRing,
  CloudRain,
  FileBarChart2,
  History,
  Layers3,
  Map,
  Menu,
  RadioTower,
  Settings2,
  ShieldAlert,
  Waves,
} from 'lucide-react'
import { useFloodData } from '../hooks/useFloodData'
import { FLOOD_LEVELS } from '../data/mockFloodData'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Activity },
  { to: '/flood-monitoring', label: 'Flood Monitoring', icon: Waves },
  { to: '/geospatial-map', label: 'Geospatial Map', icon: Map },
  { to: '/forecasting', label: 'Forecasting', icon: Layers3 },
  { to: '/alerts', label: 'Alerts & Warnings', icon: BellRing },
  { to: '/sensor-status', label: 'Sensor Status', icon: RadioTower },
  { to: '/historical-data', label: 'Historical Data', icon: History },
  { to: '/reports', label: 'Reports', icon: FileBarChart2 },
  { to: '/settings', label: 'Settings', icon: Settings2 },
]

export default function Layout() {
  const { data, isDemo } = useFloodData()
  const status = FLOOD_LEVELS[data.currentLevel]

  return (
    <div className="min-h-screen bg-[#050d1a] text-slate-200">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-cyan-900/30 bg-[#071222] lg:flex lg:flex-col">
          <div className="border-b border-cyan-900/30 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <CloudRain size={20} strokeWidth={2} />
              </div>
              <div>
                <div className="text-sm font-bold tracking-[0.22em] text-white">T.U.B.I.G.</div>
                <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-cyan-400/70">Flood monitoring system</div>
              </div>
            </div>
          </div>

          <div className="px-3 pt-6">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">Main navigation</p>
            <nav className="mt-3 space-y-0.5">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
                      isActive
                        ? 'border border-cyan-400/20 bg-cyan-400/10 text-cyan-300'
                        : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <link.icon size={15} className={isActive ? 'text-cyan-300' : 'text-slate-500'} />
                      <span>{link.label}</span>
                      {link.to === '/alerts' && data.currentLevel >= 3 && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto space-y-4 p-4">
            <div className="rounded-xl border border-cyan-900/30 bg-[#0a1a30] p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Station status</span>
                <span className={`h-1.5 w-1.5 rounded-full ${data.deviceOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="font-mono text-cyan-400">FLD-042</span>
                <span className="text-slate-600">·</span>
                <span>{data.deviceOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                <ShieldAlert size={12} style={{ color: status.color }} />
                <span>{status.label}</span>
                {isDemo && <span className="ml-auto text-cyan-400/70">DEMO</span>}
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-cyan-900/20 pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-[10px] font-bold text-cyan-300">DR</div>
              <div className="min-w-0"><p className="truncate text-[11px] font-semibold text-slate-300">Disaster Response</p><p className="text-[10px] text-slate-600">Administrator</p></div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="flex min-h-20 items-center justify-between border-b border-cyan-900/30 bg-[#071222]/90 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300"><CloudRain size={18} /></div>
              <span className="text-sm font-bold tracking-[0.18em] text-white">T.U.B.I.G.</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400/80">T.U.B.I.G. Flood Monitoring System</p>
              <p className="mt-1 text-xs text-slate-500">Sitio Tagbakin · Barangay Halang · Lipa City, Batangas</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-semibold text-emerald-400 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> System connected
              </div>
              <div className="hidden text-right sm:block"><p className="font-mono text-[10px] text-slate-400">21 SEP 2026</p><p className="mt-0.5 font-mono text-[10px] text-slate-600">PHT · LIVE</p></div>
              <button aria-label="Open menu" className="rounded-lg border border-cyan-900/40 bg-[#0a1a30] p-2.5 text-slate-400 lg:hidden"><Menu size={17} /></button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[10px] font-bold text-cyan-300">DR</div>
            </div>
          </header>

          <main className="mx-auto max-w-[1500px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <Outlet />
          </main>

          <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-cyan-900/40 bg-[#071222]/95 px-2 py-2 backdrop-blur lg:hidden">
            {links.slice(0, 4).map((link) => <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[9px] font-semibold ${isActive ? 'text-cyan-300' : 'text-slate-500'}`}><link.icon size={16} />{link.label.split(' ')[0]}</NavLink>)}
          </nav>
        </div>
      </div>
    </div>
  )
}