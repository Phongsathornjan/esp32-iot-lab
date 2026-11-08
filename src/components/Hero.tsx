import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Box, ChevronRight, Cpu, MousePointer2, Radio, X, Zap } from 'lucide-react'
import { HeroScene } from './three/HeroScene'
import { componentInfo } from '../data/circuit'
import type { ComponentId } from '../data/circuit'
import { scrollToSection } from '../lib/navigation'
import { useSimulation } from '../store/useSimulation'
import { CircuitFallback } from './circuit/CircuitFallback'
import { useWebGL } from '../hooks/useWebGL'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [inspected, setInspected] = useState<ComponentId | null>(null)
  const webgl = useWebGL()
  const inView = useInView(ref, { amount: 0.02 })
  const select = useSimulation((state) => state.selectComponent)
  const setMode = useSimulation((state) => state.setCircuitMode)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const inspect = (id: ComponentId) => { setInspected(id); select(id) }

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-28">
      <div className="grid-bg absolute inset-0" />
      <div className="absolute left-[68%] top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/[0.055] blur-[110px]" />
      <div className="absolute left-[48%] top-[40%] h-[420px] w-[420px] rounded-full bg-cyan/[0.035] blur-[100px]" />
      <div className="noise absolute inset-0" />
      <motion.div style={{ y: sceneY, opacity: sceneOpacity }} className="absolute inset-0 z-[1]">
        {webgl ? <HeroScene onSelect={inspect} active={inView} /> : <div className="ml-auto h-full w-full opacity-40 md:w-1/2"><CircuitFallback compact /></div>}
      </motion.div>
      <motion.div style={{ y: contentY }} className="section-shell pointer-events-none relative z-10">
        <div className="max-w-[680px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15, duration: 0.6 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/15 bg-cyan/[0.045] px-3 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-40" /><span className="relative h-2 w-2 rounded-full bg-cyan" /></span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cyan">Interactive engineering simulator</span>
            <span className="ml-1 font-mono text-[8px] text-slate-600">v1.0</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.25, duration: 0.75 }} className="font-display text-[46px] font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-[68px] lg:text-[80px] xl:text-[88px]">
            EXPLORE THE <br />WORLD OF <span className="text-cyan drop-shadow-[0_0_24px_rgba(98,233,255,.18)]">IoT</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.65 }} className="mt-6 max-w-lg font-display text-lg font-medium tracking-tight text-slate-200 sm:text-xl">An Interactive 3D ESP32 Electronics Laboratory</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55, duration: 0.65 }} className="mt-4 max-w-md text-sm leading-7 text-slate-400">Build intuition, not just circuits. Explore real GPIO connections, control live hardware, and see how data becomes action.</motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.65, duration: 0.6 }} className="pointer-events-auto mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="btn-primary !px-6 !py-3.5" onClick={() => { setMode('physical'); scrollToSection('laboratory') }}>Enter virtual lab <ArrowRight size={15} /></button>
            <button className="btn-secondary !px-6 !py-3.5" onClick={() => { setMode('diagram'); scrollToSection('laboratory') }}><Box size={15} />Explore circuit</button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="mt-7 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-slate-600"><MousePointer2 size={12} />Select the floating hardware to inspect</motion.div>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/[0.06] bg-[#05070d]/40 backdrop-blur-sm">
        <div className="section-shell grid h-[76px] grid-cols-3 items-center divide-x divide-white/[0.06]">
          {[['06', 'GPIO connections', Zap], ['01s', 'Live telemetry', Radio], ['100%', 'Local simulation', Cpu]].map(([value, label, Icon], index) => (
            <div key={label as string} className={`flex items-center gap-3 px-3 sm:px-6 ${index === 0 ? '!pl-0' : ''}`}><Icon size={16} className="hidden text-slate-600 sm:block" /><div><p className="font-display text-base font-semibold text-slate-200 sm:text-lg">{value as string}</p><p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.13em] text-slate-600 sm:text-[8px]">{label as string}</p></div></div>
          ))}
        </div>
      </div>
      <button onClick={() => scrollToSection('laboratory')} className="absolute bottom-24 right-7 z-10 hidden flex-col items-center gap-2 text-slate-600 transition hover:text-cyan lg:flex" aria-label="Scroll to laboratory"><span className="font-mono text-[7px] uppercase tracking-[0.25em] [writing-mode:vertical-lr]">Scroll to explore</span><ArrowDown size={13} className="animate-bounce" /></button>
      <AnimatePresence>
        {inspected && <motion.aside initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass absolute bottom-24 right-5 z-20 w-[calc(100%-40px)] max-w-sm rounded-2xl p-5 shadow-2xl sm:right-8">
          <button onClick={() => setInspected(null)} className="icon-button absolute right-3 top-3 !h-7 !w-7" aria-label="Close component information"><X size={13} /></button>
          <p className="eyebrow">{componentInfo[inspected].category}</p><h3 className="mt-2 pr-8 font-display text-xl font-semibold">{componentInfo[inspected].name}</h3><p className="mt-3 text-xs leading-6 text-slate-400">{componentInfo[inspected].purpose}</p>
          <button className="mt-4 flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-cyan" onClick={() => { setMode('physical'); scrollToSection('laboratory'); setInspected(null) }}>Inspect on the bench <ChevronRight size={13} /></button>
        </motion.aside>}
      </AnimatePresence>
    </section>
  )
}
