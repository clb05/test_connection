import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Waves, Eye, EyeOff, Shield } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ username: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-[at_50%_60%] from-cyan-900/30 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo block */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 mb-4 shadow-lg shadow-cyan-500/20">
            <Waves size={30} className="text-[#071222]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">T.U.B.I.G.</h1>
          <p className="text-xs text-slate-400 mt-1">Targeted Ubiquitous Basin Instrumentation for<br />Geospatial Flood Forecasting</p>
          <div className="mt-2 text-[11px] text-cyan-400/70 font-mono">Sitio Tagbakin · Barangay Halang · Lipa City, Batangas</div>
        </div>

        <div className="bg-[#0a1a30]/80 border border-cyan-900/40 rounded-2xl p-8 backdrop-blur-sm shadow-xl shadow-cyan-950/50">
          <div className="flex items-center gap-2 mb-6">
            <Shield size={14} className="text-cyan-400" />
            <span className="text-xs text-slate-400 font-mono">SECURE SYSTEM ACCESS</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide uppercase">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="lgu.admin"
                className="w-full bg-[#071222] border border-cyan-900/60 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full bg-[#071222] border border-cyan-900/60 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 transition-all"
                />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-[#071222] font-bold py-2.5 rounded-lg text-sm transition-all duration-200 shadow-md shadow-cyan-500/20 mt-2"
            >
              Sign In to System
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-600 mt-4">
            Authorized personnel only · LGU Disaster Risk Reduction
          </p>
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-6">
          BSCS Thesis Prototype · Batangas State University · 2024
        </p>
      </div>
    </div>
  )
}
