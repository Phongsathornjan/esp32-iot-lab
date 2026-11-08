import { motion } from 'framer-motion'
import { ArrowRight, Cpu } from 'lucide-react'
import { pinMapping } from '../../data/circuit'
import { useGPIO, useSimulation } from '../../store/useSimulation'

export function GPIOMapping() {
  const gpio = useGPIO()
  const selected = useSimulation((state) => state.selectedComponent)
  const select = useSimulation((state) => state.selectComponent)
  const highlight = useSimulation((state) => state.highlightPin)

  return (
    <div className="grid min-h-[540px] gap-6 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
      <div className="flex flex-col justify-center rounded-2xl border border-cyan/10 bg-cyan/[0.025] p-6 sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/[0.06] text-cyan"><Cpu size={26} /></div>
        <p className="eyebrow">ESP32 DevKit V1</p>
        <h3 className="mt-3 font-display text-2xl font-semibold">Pin map & live logic</h3>
        <p className="mt-4 text-sm leading-7 text-slate-400">Select any pin to inspect its route. Output indicators are derived directly from the shared LED and relay state, so the pin map can never disagree with the circuit.</p>
        <div className="mt-6 flex gap-5 font-mono text-[10px] text-slate-500"><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />HIGH ≈ 3.3V</span><span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-slate-600" />LOW = 0V</span></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.07]">
        <div className="grid grid-cols-[72px_1fr_100px] border-b border-white/[0.07] bg-white/[0.025] px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-slate-500 sm:grid-cols-[90px_1fr_120px_90px]"><span>GPIO</span><span>Connection</span><span className="hidden sm:block">Function</span><span className="text-right">Logic</span></div>
        {pinMapping.map((pin, index) => {
          const active = pin.pin in gpio ? gpio[pin.pin as keyof typeof gpio] : true
          return (
            <motion.button
              key={pin.pin}
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
              onClick={() => { select(pin.component); highlight(pin.pin) }}
              onMouseEnter={() => highlight(pin.pin)} onMouseLeave={() => highlight(null)}
              className={`grid w-full grid-cols-[72px_1fr_100px] items-center px-4 py-4 text-left transition sm:grid-cols-[90px_1fr_120px_90px] ${selected === pin.component ? 'bg-cyan/[0.06]' : 'hover:bg-white/[0.03]'}`}
            >
              <span className="font-mono text-sm font-semibold" style={{ color: pin.color }}>{pin.pin}</span>
              <span className="flex items-center gap-2 text-xs text-slate-300">{pin.label}<ArrowRight size={12} className="text-slate-600" /></span>
              <span className="hidden font-mono text-[9px] text-slate-500 sm:block">{pin.role}</span>
              <span className={`justify-self-end rounded px-2 py-1 font-mono text-[9px] ${active ? 'bg-emerald-400/10 text-emerald-300' : 'bg-slate-700/30 text-slate-500'}`}>{pin.pin === 21 || pin.pin === 22 ? 'I²C' : active ? 'HIGH' : 'LOW'}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
