import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Box, Cable, ChevronDown, Cpu, Lightbulb, Power, Thermometer } from 'lucide-react'
import { componentInfo } from '../../data/circuit'
import { useSimulation } from '../../store/useSimulation'
import { StatusDot } from '../ui/StatusDot'

const icons = { esp32: Cpu, relay: Power, sht31: Thermometer, breadboard: Box }

export function ComponentQuickInfo() {
  const [expanded, setExpanded] = useState(false)
  const selected = useSimulation((state) => state.selectedComponent)
  const leds = useSimulation((state) => state.leds)
  const relay = useSimulation((state) => state.relay)
  const toggleLed = useSimulation((state) => state.toggleLed)
  const toggleRelay = useSimulation((state) => state.toggleRelay)
  const info = componentInfo[selected]
  const led = selected.startsWith('led-') ? selected.replace('led-', '') as 'red' | 'yellow' | 'green' : null
  const Icon = led ? Lightbulb : selected.startsWith('resistor') ? Cable : icons[selected as keyof typeof icons] ?? Cpu
  const active = led ? leds[led] : selected === 'relay' ? relay : null
  const activeColor = led ? (led === 'red' ? '#ff5263' : led === 'yellow' ? '#ffc85a' : '#57e39a') : '#ae86ff'

  return (
    <div className="panel mt-3 overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan/15 bg-cyan/[0.05] text-cyan"><Icon size={16} /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2"><p className="font-mono text-[7px] uppercase tracking-[0.15em] text-slate-600">Selected · {info.category}</p>{active !== null && <StatusDot active={active} color={activeColor} />}</div>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-200">{info.name}</p>
          </div>
        </div>
        <p className="hidden max-w-[420px] flex-1 truncate text-[10px] text-slate-500 lg:block">{info.purpose}</p>
        <div className="flex shrink-0 items-center gap-2">
          {led && <button onClick={() => toggleLed(led, 'physical')} className="btn-secondary !px-2.5 !py-2 font-mono !text-[8px]"><Lightbulb size={11} />Physical toggle</button>}
          {selected === 'relay' && <button onClick={() => toggleRelay('physical')} className="btn-secondary !px-2.5 !py-2 font-mono !text-[8px]"><Power size={11} />Physical toggle</button>}
          <button onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="btn-secondary !px-2.5 !py-2 font-mono !text-[8px]">Technical sheet <ChevronDown size={11} className={`transition ${expanded ? 'rotate-180' : ''}`} /></button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/[0.06]">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div>
                <p className="metric-label mb-2">Purpose</p>
                <p className="text-[10px] leading-5 text-slate-400">{info.purpose}</p>
                <p className="metric-label mb-2 mt-4">Electrical characteristics</p>
                <div className="flex flex-wrap gap-1.5">{info.specifications.map((spec) => <span key={spec} className="rounded border border-white/[0.07] bg-white/[0.025] px-2 py-1 font-mono text-[8px] text-slate-400">{spec}</span>)}</div>
              </div>
              <div>
                <p className="metric-label mb-2">GPIO & connections</p>
                <div className="space-y-1.5">{info.connections.map((connection) => <div key={connection} className="rounded border border-cyan/10 bg-cyan/[0.025] px-2.5 py-1.5 font-mono text-[8px] leading-4 text-cyan/75">{connection}</div>)}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
