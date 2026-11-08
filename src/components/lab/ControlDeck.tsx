import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Lightbulb, Power, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import { useSimulation } from '../../store/useSimulation'
import type { LabTab } from '../../store/useSimulation'
import { LEDControlPanel } from './LEDControlPanel'
import { TelemetryPanel } from './TelemetryPanel'
import { NetworkPanel } from './NetworkPanel'
import { RelayControl } from '../dashboard/RelayControl'
import { StatusDot } from '../ui/StatusDot'

const tabs: { id: LabTab; label: string; icon: typeof Lightbulb }[] = [
  { id: 'led', label: 'LED Control', icon: Lightbulb },
  { id: 'dashboard', label: 'Live Dashboard', icon: Activity },
  { id: 'relay', label: '5V Relay', icon: Power },
  { id: 'network', label: 'Wi-Fi Network', icon: Wifi },
]

export function ControlDeck() {
  const active = useSimulation((state) => state.activeLabTab)
  const setTab = useSimulation((state) => state.setLabTab)
  const setMode = useSimulation((state) => state.setCircuitMode)
  const connected = useSimulation((state) => state.wifiConnected)
  const reset = useSimulation((state) => state.resetSimulation)

  const activate = (tab: LabTab) => {
    setTab(tab)
    setMode('physical')
  }

  return (
    <div className="panel flex h-[620px] min-w-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
        <div>
          <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500"><span className="h-1 w-1 rounded-full bg-cyan" />Live control deck</p>
          <p className="mt-1 font-display text-sm font-semibold text-white">Circuit command center</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => activate('network')} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-wider transition ${connected ? 'border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-300' : 'border-amber-300/20 bg-amber-300/[0.04] text-amber-200'}`}>
            <StatusDot active={connected} color={connected ? '#57e39a' : '#f6c453'} />
            {connected ? 'Remote link' : 'Local only'}
          </button>
          <button onClick={reset} className="icon-button !h-8 !w-8" aria-label="Reset simulator outputs" title="Reset simulator outputs"><RotateCcw size={12} /></button>
        </div>
      </div>

      <div role="tablist" aria-label="Circuit control tabs" className="grid shrink-0 grid-cols-4 border-b border-white/[0.07] bg-[#080d16] px-1.5 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={selected}
              aria-controls={`lab-panel-${tab.id}`}
              id={`lab-tab-${tab.id}`}
              onClick={() => activate(tab.id)}
              className={`relative flex flex-col items-center gap-1 rounded-md px-1 py-2 font-mono text-[7px] uppercase tracking-[0.07em] transition ${selected ? 'bg-cyan/[0.07] text-cyan' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}
            >
              <Icon size={13} />
              <span className="whitespace-nowrap">{tab.label}</span>
              {selected && <motion.span layoutId="control-tab" className="absolute inset-x-2 -bottom-[7px] h-px bg-cyan shadow-[0_0_8px_#62e9ff]" />}
            </button>
          )
        })}
      </div>

      {!connected && (
        <button onClick={() => activate('network')} className="flex shrink-0 items-center gap-2 border-b border-amber-400/10 bg-amber-400/[0.035] px-4 py-2 text-left font-mono text-[8px] text-amber-200/70 transition hover:bg-amber-400/[0.06]"><WifiOff size={11} />Remote controls locked. Open the Wi-Fi Network tab to reconnect.</button>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`lab-panel-${active}`}
            aria-labelledby={`lab-tab-${active}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.16 }}
          >
            {active === 'led' && <LEDControlPanel />}
            {active === 'dashboard' && <TelemetryPanel />}
            {active === 'relay' && <RelayControl embedded />}
            {active === 'network' && <NetworkPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#080d16] px-4 py-2 font-mono text-[7px] uppercase tracking-wider text-slate-600">
        <span className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-emerald-400" />Simulation synced</span>
        <span>3D ↔ GPIO ↔ UI</span>
      </div>
    </div>
  )
}
