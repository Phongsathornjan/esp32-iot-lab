import { useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Camera, ChevronDown, MousePointer2, RotateCcw, Scan, Waypoints } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { cameraPresets, componentInfo, pinMapping } from '../data/circuit'
import type { CircuitMode } from '../data/circuit'
import { useGPIO, useSimulation } from '../store/useSimulation'
import { CircuitScene } from './three/CircuitScene'
import { ControlDeck } from './lab/ControlDeck'
import { ComponentQuickInfo } from './circuit/ComponentQuickInfo'
import { CircuitDiagram } from './circuit/CircuitDiagram'
import { GPIOMapping } from './circuit/GPIOMapping'
import { CircuitFallback } from './circuit/CircuitFallback'
import { useWebGL } from '../hooks/useWebGL'

const modes: { id: CircuitMode; label: string }[] = [
  { id: 'physical', label: 'Physical wiring' },
  { id: 'diagram', label: 'Connection diagram' },
  { id: 'mapping', label: 'GPIO mapping' },
]

export function CircuitLab() {
  const [cameraMenu, setCameraMenu] = useState(false)
  const section = useRef<HTMLElement>(null)
  const shouldLoad3D = useInView(section, { once: true, amount: 0.02 })
  const webgl = useWebGL()
  const mode = useSimulation((state) => state.circuitMode)
  const setMode = useSimulation((state) => state.setCircuitMode)
  const selected = useSimulation((state) => state.selectedComponent)
  const setCamera = useSimulation((state) => state.setCameraPreset)
  const cameraPreset = useSimulation((state) => state.cameraPreset)
  const highlightPin = useSimulation((state) => state.highlightPin)
  const highlightedPin = useSimulation((state) => state.highlightedPin)
  const select = useSimulation((state) => state.selectComponent)
  const gpio = useGPIO()
  const physical3D = mode === 'physical' && webgl

  return (
    <section ref={section} id="laboratory" className="relative py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading number="02" eyebrow="Virtual electronics bench" title="Control the circuit. See it respond." description="The live control deck sits directly beside the 3D circuit. Switch tabs to control LEDs, monitor the SHT31, operate the relay, or connect to the ESP32 access point—every action is reflected instantly on the bench." />
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex overflow-x-auto rounded-lg border border-white/[0.08] bg-[#0a0e17] p-1">
            {modes.map((item) => <button key={item.id} onClick={() => setMode(item.id)} className={`whitespace-nowrap rounded-md px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.12em] transition ${mode === item.id ? 'bg-cyan/10 text-cyan shadow-[inset_0_0_0_1px_rgba(98,233,255,.15)]' : 'text-slate-500 hover:text-slate-200'}`}>{item.label}</button>)}
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Simulation running<span className="text-slate-800">/</span>60 FPS target</div>
        </div>
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_440px]">
          <div className="min-w-0">
          <div className="panel relative min-w-0 overflow-hidden bg-[#070b13]">
            {webgl && shouldLoad3D && (
              <div className={physical3D ? 'contents' : 'hidden'}>
                <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 pointer-events-none">
                  <div className="pointer-events-auto rounded-lg border border-white/10 bg-[#090e18]/85 px-3 py-2 backdrop-blur-md">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500">Now inspecting</p>
                    <p className="mt-1 font-display text-xs font-medium text-white">{componentInfo[selected].name}</p>
                  </div>
                  <div className="pointer-events-auto relative flex gap-2">
                    <button className="btn-secondary !px-3 !py-2" onClick={() => setCameraMenu(!cameraMenu)} aria-expanded={cameraMenu}><Camera size={13} /><span className="hidden sm:inline">{cameraPresets.find((p) => p.id === cameraPreset)?.label}</span><ChevronDown size={12} /></button>
                    <button className="icon-button bg-[#090e18]/85" onClick={() => setCamera('overview')} aria-label="Reset camera"><RotateCcw size={14} /></button>
                    {cameraMenu && <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-white/10 bg-[#0b101c]/95 p-1.5 shadow-2xl backdrop-blur-xl">{cameraPresets.map((preset) => <button key={preset.id} onClick={() => { setCamera(preset.id); setCameraMenu(false) }} className={`w-full rounded-lg px-3 py-2.5 text-left text-[11px] transition ${cameraPreset === preset.id ? 'bg-cyan/10 text-cyan' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>{preset.label}</button>)}</div>}
                  </div>
                </div>
                <CircuitScene />
                <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-4 rounded-lg border border-white/[0.07] bg-[#090e18]/80 px-3 py-2 font-mono text-[8px] uppercase tracking-wider text-slate-500 backdrop-blur-md"><span className="flex items-center gap-1.5"><MousePointer2 size={11} />Click to inspect</span><span className="flex items-center gap-1.5"><Scan size={11} />Drag to orbit</span><span className="hidden sm:inline">Scroll to zoom</span></div>
              </div>
            )}
            {!webgl && mode === 'physical' && <CircuitFallback />}
            {mode === 'diagram' && <CircuitDiagram />}
            {mode === 'mapping' && <GPIOMapping />}
          </div>
          <ComponentQuickInfo />
          </div>
          <ControlDeck />
        </div>
        <div className="panel mt-4 overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5"><span className="metric-label flex items-center gap-2"><Waypoints size={13} className="text-cyan" />Live GPIO bus</span><span className="hidden font-mono text-[8px] uppercase tracking-widest text-slate-600 sm:block">Hover or select a pin to trace</span></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {pinMapping.map((pin) => {
              const high = pin.pin in gpio ? gpio[pin.pin as keyof typeof gpio] : true
              return <button key={pin.pin} onClick={() => { select(pin.component); highlightPin(pin.pin) }} onMouseEnter={() => highlightPin(pin.pin)} onMouseLeave={() => highlightPin(null)} className={`group border-b border-r border-white/[0.06] p-4 text-left transition last:border-r-0 sm:border-b-0 ${highlightedPin === pin.pin ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}><div className="flex items-center justify-between"><span className="font-mono text-[10px] font-semibold" style={{ color: pin.color }}>GPIO {pin.pin}</span><span className={`h-1.5 w-1.5 rounded-full ${high ? 'live-dot' : 'bg-slate-700'}`} style={high ? { backgroundColor: pin.color, color: pin.color } : undefined} /></div><p className="mt-2 truncate text-[10px] text-slate-400">{pin.label}</p><p className="mt-1 font-mono text-[8px] text-slate-600">{pin.pin === 21 || pin.pin === 22 ? pin.role : high ? 'OUTPUT HIGH' : 'OUTPUT LOW'}</p></button>
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
