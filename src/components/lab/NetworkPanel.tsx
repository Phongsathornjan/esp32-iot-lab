import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Globe2, LockKeyhole, Radio, Router, Smartphone, Unplug, Wifi, WifiOff } from 'lucide-react'
import { useSimulation } from '../../store/useSimulation'
import { StatusDot } from '../ui/StatusDot'

export function NetworkPanel() {
  const connected = useSimulation((state) => state.wifiConnected)
  const setConnected = useSimulation((state) => state.setWifiConnected)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    if (!connecting) return
    const timer = window.setTimeout(() => {
      setConnected(true)
      setConnecting(false)
    }, 1400)
    return () => window.clearTimeout(timer)
  }, [connecting, setConnected])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">ESP32 access point</p>
          <h3 className="mt-1 font-display text-base font-semibold">Local Wireless Network</h3>
        </div>
        <span className="chip !border-emerald-400/20 !text-emerald-300"><StatusDot color="#57e39a" />ONLINE</span>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-cyan/15 bg-cyan/[0.025] p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/[0.06] text-cyan"><Router size={19} /></div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold">ESP32-IOT</p>
          <p className="mt-0.5 font-mono text-[8px] text-slate-500">192.168.4.1 · WPA2-PSK</p>
        </div>
        <span className="font-mono text-[8px] text-cyan">{connected ? '1 CLIENT' : '0 CLIENTS'}</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#070b13] px-4 py-5">
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="text-center">
            <div className="flex h-16 w-14 flex-col items-center justify-center rounded-xl border border-cyan/25 bg-[#0e1825]"><Radio size={22} className="text-cyan" /><span className="mt-1.5 font-mono text-[6px] tracking-widest text-slate-400">ESP32</span></div>
            <p className="mt-2 font-mono text-[7px] text-cyan">AP HOST</p>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <svg className="w-full" viewBox="0 0 120 26" preserveAspectRatio="none"><path d="M0 13 H120" stroke={connected ? '#62e9ff' : '#263145'} strokeWidth="1.5" strokeDasharray="4 5" /><path d="M0 13 H120" stroke={connected ? '#62e9ff' : 'transparent'} strokeWidth="3" strokeDasharray="4 20" className={connected ? 'packet' : ''} /></svg>
            <Wifi size={19} className={`absolute rounded-full bg-[#070b13] p-0.5 ${connected ? 'text-cyan' : 'text-slate-700'}`} />
            {connecting && <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="absolute h-10 w-10 rounded-full border border-transparent border-t-cyan" />}
          </div>
          <div className="text-center">
            <div className={`relative mx-auto flex h-24 w-12 flex-col items-center justify-center rounded-[10px] border-2 bg-[#080e18] transition ${connected ? 'border-cyan/50 shadow-[0_0_22px_rgba(98,233,255,.12)]' : 'border-slate-700'}`}>
              <span className="absolute -mt-[74px] h-1 w-5 rounded-full bg-slate-700" />
              {connected ? <><Globe2 size={16} className="text-cyan" /><p className="mt-2 font-mono text-[5px] text-emerald-300">DASHBOARD</p></> : connecting ? <Wifi size={16} className="animate-pulse text-cyan" /> : <WifiOff size={16} className="text-slate-600" />}
            </div>
            <p className="mt-2 font-mono text-[7px] text-slate-500"><Smartphone size={8} className="mr-1 inline" />{connected ? '192.168.4.2' : 'CLIENT'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
        <div className="flex items-center gap-2">
          <StatusDot active={connected || connecting} color={connected ? '#57e39a' : '#f6c453'} />
          <span className="font-mono text-[8px] uppercase tracking-wider text-slate-400">{connected ? 'Remote link established' : connecting ? 'Authenticating…' : 'Remote link unavailable'}</span>
        </div>
        <span className="font-mono text-[7px] text-slate-600">2.4 GHZ</span>
      </div>

      {connected ? (
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary !px-2 !py-2.5" onClick={() => setConnected(false)}><Unplug size={12} />Disconnect</button>
          <div className="flex items-center justify-center gap-1 font-mono text-[8px] text-emerald-300"><LockKeyhole size={10} />CONTROLS UNLOCKED</div>
        </div>
      ) : (
        <button disabled={connecting} className="btn-primary w-full" onClick={() => setConnecting(true)}>{connecting ? <><Radio size={13} className="animate-pulse" />Connecting…</> : <><Wifi size={13} />Connect to ESP32-IOT</>}</button>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5"><LockKeyhole size={12} className="mt-0.5 shrink-0 text-slate-600" /><p className="text-[9px] leading-4 text-slate-500">The local access point works without internet. Disconnecting locks remote controls but keeps the physical simulation visible.</p></div>
    </div>
  )
}
