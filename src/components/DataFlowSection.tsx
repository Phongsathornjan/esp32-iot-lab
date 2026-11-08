import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, ChevronRight, CircuitBoard, Cloud, Code2, Gauge, Lightbulb, MousePointerClick, Play, Radio, Send, Thermometer, Wifi, WifiOff } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { useSimulation } from '../store/useSimulation'

const telemetryNodes = [
  { title: 'SHT31 Sensor', subtitle: '28.5°C · 64% RH', icon: Thermometer, payload: '{ temperature, humidity }' },
  { title: 'I²C Communication', subtitle: 'SDA 21 · SCL 22', icon: CircuitBoard, payload: 'I²C READ · 0x44' },
  { title: 'ESP32', subtitle: 'Process reading', icon: Code2, payload: 'serializeJSON()' },
  { title: 'Wi-Fi Access Point', subtitle: 'ESP32-IOT', icon: Wifi, payload: '192.168.4.1' },
  { title: 'HTTP / WebSocket', subtitle: 'Local data channel', icon: Cloud, payload: 'GET /api/sensors' },
  { title: 'Web Dashboard', subtitle: 'Render live charts', icon: Gauge, payload: 'UI UPDATE · 1 Hz' },
]
const controlNodes = [
  { title: 'User clicks LED ON', subtitle: 'Red LED control', icon: MousePointerClick, payload: 'click · red-led' },
  { title: 'Dashboard sends command', subtitle: 'Local HTTP request', icon: Send, payload: 'POST /api/led/red' },
  { title: 'ESP32 receives command', subtitle: 'Validate & route', icon: Code2, payload: '{ state: "HIGH" }' },
  { title: 'GPIO 25 becomes HIGH', subtitle: 'Output ≈ 3.3V', icon: CircuitBoard, payload: 'digitalWrite(25, HIGH)' },
  { title: 'Red LED illuminates', subtitle: 'Physical output', icon: Lightbulb, payload: 'CURRENT FLOWS · LED ON' },
]

type Scenario = 'telemetry' | 'control'

export function DataFlowSection() {
  const [scenario, setScenario] = useState<Scenario>('telemetry')
  const [activeStep, setActiveStep] = useState(-1)
  const [running, setRunning] = useState(false)
  const connected = useSimulation((state) => state.wifiConnected)
  const toggleLed = useSimulation((state) => state.toggleLed)
  const tickSensor = useSimulation((state) => state.tickSensor)
  const nodes = scenario === 'telemetry' ? telemetryNodes : controlNodes

  useEffect(() => {
    if (!running) return
    if (activeStep >= nodes.length - 1) {
      const finish = window.setTimeout(() => setRunning(false), 850)
      return () => window.clearTimeout(finish)
    }
    const timer = window.setTimeout(() => setActiveStep((step) => step + 1), 680)
    return () => window.clearTimeout(timer)
  }, [running, activeStep, nodes.length])

  const trigger = (type: Scenario) => {
    if (!connected || running) return
    setScenario(type)
    setActiveStep(0)
    setRunning(true)
    if (type === 'control') {
      if (!useSimulation.getState().leds.red) toggleLed('red')
    } else tickSensor()
  }

  const switchScenario = (type: Scenario) => { if (!running) { setScenario(type); setActiveStep(-1) } }

  return (
    <section id="data-flow" className="relative py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading number="04" eyebrow="Data flow visualizer" title="Follow every bit from sensor to screen." description="Trigger a complete telemetry or control scenario. Watch the packet payload transform as it crosses the I²C bus, ESP32 firmware, wireless network, and browser interface." />
        <div className="panel overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex rounded-lg border border-white/[0.08] bg-[#070b13] p-1"><button onClick={() => switchScenario('telemetry')} className={`rounded-md px-4 py-2 font-mono text-[9px] uppercase tracking-wider transition ${scenario === 'telemetry' ? 'bg-cyan/10 text-cyan' : 'text-slate-500'}`}>Sensor telemetry</button><button onClick={() => switchScenario('control')} className={`rounded-md px-4 py-2 font-mono text-[9px] uppercase tracking-wider transition ${scenario === 'control' ? 'bg-violet/10 text-violet' : 'text-slate-500'}`}>LED control</button></div>
            <button disabled={!connected || running} onClick={() => trigger(scenario)} className="btn-primary !py-2.5"><Play size={13} />{running ? 'Transmitting…' : 'Run scenario'}</button>
          </div>
          {!connected && <div className="flex items-center gap-2 border-b border-amber-400/10 bg-amber-400/[0.03] px-5 py-3 font-mono text-[9px] text-amber-200/70"><WifiOff size={13} />Connect to ESP32-IOT in the Wi-Fi Network tab of the 3D lab to run end-to-end scenarios.</div>}
          <div className="relative p-5 sm:p-8">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className={`relative grid gap-3 ${scenario === 'telemetry' ? 'lg:grid-cols-6' : 'lg:grid-cols-5'}`}>
              {nodes.map((node, index) => {
                const Icon = node.icon; const active = activeStep === index; const complete = activeStep > index || (!running && activeStep === nodes.length - 1 && index <= activeStep)
                return <div key={node.title} className="relative">
                  <motion.button
                    animate={active ? { y: -5, borderColor: scenario === 'telemetry' ? '#62e9ff' : '#9b8cff', boxShadow: `0 0 30px ${scenario === 'telemetry' ? 'rgba(98,233,255,.12)' : 'rgba(155,140,255,.12)'}` } : { y: 0 }}
                    onClick={() => !running && setActiveStep(index)}
                    className={`relative z-10 flex min-h-[155px] w-full flex-col items-start rounded-xl border p-4 text-left transition lg:min-h-[190px] ${complete ? 'border-emerald-400/20 bg-emerald-400/[0.025]' : active ? scenario === 'telemetry' ? 'bg-cyan/[0.05]' : 'bg-violet/[0.05]' : 'border-white/[0.08] bg-[#0a0f19]'}`}
                  >
                    <div className="flex w-full items-center justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${active ? scenario === 'telemetry' ? 'border-cyan/30 text-cyan' : 'border-violet/30 text-violet' : complete ? 'border-emerald-400/20 text-emerald-300' : 'border-white/10 text-slate-500'}`}><Icon size={17} /></span><span className="font-mono text-[8px] text-slate-600">{String(index + 1).padStart(2, '0')}</span></div>
                    <p className="mt-4 text-xs font-medium leading-5 text-slate-200">{node.title}</p><p className="mt-1 font-mono text-[8px] leading-4 text-slate-600">{node.subtitle}</p>
                    <AnimatePresence>{active && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`mt-auto pt-3 font-mono text-[7px] ${scenario === 'telemetry' ? 'text-cyan' : 'text-violet'}`}>PACKET IN TRANSIT</motion.span>}{complete && !active && <span className="mt-auto flex items-center gap-1 pt-3 font-mono text-[7px] text-emerald-400"><Check size={9} />COMPLETE</span>}</AnimatePresence>
                  </motion.button>
                  {index < nodes.length - 1 && <div className={`relative z-20 flex h-5 items-center justify-center lg:absolute lg:-right-[19px] lg:top-1/2 lg:z-20 lg:h-8 lg:w-9 lg:-translate-y-1/2 ${activeStep === index ? scenario === 'telemetry' ? 'text-cyan' : 'text-violet' : 'text-slate-700'}`}><ArrowRight size={15} className={`hidden lg:block ${activeStep === index ? 'animate-pulse' : ''}`} /><ArrowDown size={14} className="lg:hidden" />{activeStep === index && <motion.span layoutId="packet" className={`absolute h-1.5 w-1.5 rounded-full ${scenario === 'telemetry' ? 'bg-cyan' : 'bg-violet'} shadow-[0_0_10px_currentColor]`} />}</div>}
                </div>
              })}
            </div>
            <div className="relative mt-6 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#070b13] p-4 font-mono sm:flex-row sm:items-center"><span className={`rounded px-2 py-1 text-[8px] uppercase tracking-wider ${scenario === 'telemetry' ? 'bg-cyan/10 text-cyan' : 'bg-violet/10 text-violet'}`}>{activeStep >= 0 ? `Step ${activeStep + 1}/${nodes.length}` : 'Ready'}</span><span className="text-[10px] text-slate-400">{activeStep >= 0 ? nodes[activeStep]?.payload : 'Select a scenario, then run it to inspect each packet.'}</span><span className="ml-auto flex items-center gap-1 text-[8px] text-slate-600">{running ? <><Radio size={11} className="animate-pulse" />LIVE</> : <><ChevronRight size={11} />LOCAL SIMULATION</>}</span></div>
          </div>
          <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"><p className="text-[10px] text-slate-500">Predefined scenarios execute against the same live simulation—not a prerecorded animation.</p><div className="flex gap-2"><button disabled={!connected || running} onClick={() => trigger('telemetry')} className="btn-secondary !px-3 !py-2"><Thermometer size={12} />Read environment</button><button disabled={!connected || running} onClick={() => trigger('control')} className="btn-secondary !px-3 !py-2"><Lightbulb size={12} />Red LED ON</button></div></div>
        </div>
      </div>
    </section>
  )
}
