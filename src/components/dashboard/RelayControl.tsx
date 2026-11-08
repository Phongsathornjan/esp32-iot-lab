import { motion } from 'framer-motion'
import { AlertTriangle, Power, Zap } from 'lucide-react'
import { useSimulation } from '../../store/useSimulation'
import { Toggle } from '../ui/Toggle'

export function RelayControl({ embedded = false }: { embedded?: boolean }) {
  const relay = useSimulation((state) => state.relay)
  const connected = useSimulation((state) => state.wifiConnected)
  const toggle = useSimulation((state) => state.toggleRelay)

  return (
    <div className={embedded ? 'flex flex-col' : 'panel flex h-full flex-col overflow-hidden'}>
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3"><div><p className="metric-label">Isolated switching</p><h3 className="mt-1 font-display text-base font-semibold">5V relay module</h3></div><Toggle checked={relay} onChange={() => toggle()} disabled={!connected} label="Relay power" color="#ae86ff" /></div>
      <div className="flex-1 py-4">
        <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#070b13] p-4">
          <div className="flex items-center justify-between"><span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Contact mechanism</span><motion.span animate={{ opacity: relay ? 1 : 0.55 }} className={`chip ${relay ? '!border-violet/30 !text-violet' : ''}`}><Zap size={9} />{relay ? 'Coil energized' : 'Coil at rest'}</motion.span></div>
          <svg viewBox="0 0 360 170" className="mt-3 w-full" aria-label={`Relay contact diagram: ${relay ? 'normally open contact closed' : 'normally closed contact closed'}`}>
            <text x="26" y="32" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">NC</text><text x="26" y="82" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">COM</text><text x="26" y="132" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">NO</text>
            <circle cx="60" cy="28" r="5" fill={relay ? '#283248' : '#57e39a'} /><circle cx="60" cy="78" r="5" fill="#ae86ff" /><circle cx="60" cy="128" r="5" fill={relay ? '#57e39a' : '#283248'} />
            <circle cx="240" cy="28" r="5" fill={relay ? '#283248' : '#57e39a'} /><circle cx="240" cy="128" r="5" fill={relay ? '#57e39a' : '#283248'} />
            <path d="M60 78 H110" stroke="#ae86ff" strokeWidth="3" />
            <motion.g animate={{ rotate: relay ? 25 : -17 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }} style={{ transformOrigin: '110px 78px' }}><path d="M110 78 H235" stroke={relay ? '#57e39a' : '#ae86ff'} strokeWidth="4" strokeLinecap="round" /></motion.g>
            <path d="M240 28 H290 V55" fill="none" stroke={relay ? '#283248' : '#57e39a'} strokeWidth="2" /><path d="M240 128 H290 V101" fill="none" stroke={relay ? '#57e39a' : '#283248'} strokeWidth="2" />
            <rect x="130" y="137" width="80" height="20" rx="4" fill="#151c29" stroke="#354057" /><path d="M140 147 H200" stroke={relay ? '#ae86ff' : '#536074'} strokeWidth="5" strokeDasharray="4 3" /><text x="240" y="151" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono">5V COIL</text>
          </svg>
        </div>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-3"><span className="font-mono text-[9px] text-slate-500">GPIO 23 · MODULE IN</span><span className={`font-mono text-[10px] ${relay ? 'text-violet' : 'text-slate-400'}`}>{relay ? 'HIGH' : 'LOW'}</span></div>
          <div className="grid grid-cols-2 gap-3"><div className={`rounded-lg border p-3 ${relay ? 'border-white/[0.06] opacity-45' : 'border-emerald-400/20 bg-emerald-400/[0.04]'}`}><p className="font-mono text-[9px] text-slate-400">NC contact</p><p className={`mt-1 text-xs ${relay ? 'text-slate-400' : 'text-emerald-300'}`}>{relay ? 'OPEN' : 'CLOSED'}</p></div><div className={`rounded-lg border p-3 ${relay ? 'border-emerald-400/20 bg-emerald-400/[0.04]' : 'border-white/[0.06] opacity-45'}`}><p className="font-mono text-[9px] text-slate-400">NO contact</p><p className={`mt-1 text-xs ${relay ? 'text-emerald-300' : 'text-slate-400'}`}>{relay ? 'CLOSED' : 'OPEN'}</p></div></div>
        </div>
        <div className="mt-5 flex gap-3 rounded-lg border border-amber-300/10 bg-amber-300/[0.025] p-3"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-300/70" /><p className="text-[10px] leading-5 text-slate-500">The module needs a suitable <strong className="font-medium text-slate-300">5V supply</strong> and 3.3V-compatible logic input. GPIO 23 controls IN—it does not power the relay coil.</p></div>
      </div>
      <button disabled={!connected} onClick={() => toggle()} className={`${relay ? 'btn-secondary' : 'btn-primary'}`}><Power size={14} />{relay ? 'De-energize relay' : 'Energize relay'}</button>
    </div>
  )
}
