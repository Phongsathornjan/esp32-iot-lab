import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Check, CheckCircle2, ChevronRight, Circle, Crosshair, Play, Trophy } from 'lucide-react'
import { lessons } from '../data/education'
import type { ComponentId } from '../data/circuit'
import { useSimulation } from '../store/useSimulation'
import { SectionHeading } from './ui/SectionHeading'
import { LessonVisual } from './LessonVisual'
import { scrollToSection } from '../lib/navigation'

const STORAGE_KEY = 'nexus-iot-lessons'

export function LearningSection() {
  const [activeId, setActiveId] = useState(1)
  const [completed, setCompleted] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as number[] } catch { return [] }
  })
  const [demoMessage, setDemoMessage] = useState('')
  const lesson = lessons.find((item) => item.id === activeId) ?? lessons[0]
  const selectComponent = useSimulation((state) => state.selectComponent)
  const setMode = useSimulation((state) => state.setCircuitMode)
  const setLabTab = useSimulation((state) => state.setLabTab)
  const setCamera = useSimulation((state) => state.setCameraPreset)
  const highlightPin = useSimulation((state) => state.highlightPin)
  const toggleLed = useSimulation((state) => state.toggleLed)
  const toggleRelay = useSimulation((state) => state.toggleRelay)
  const tickSensor = useSimulation((state) => state.tickSensor)
  const setWifi = useSimulation((state) => state.setWifiConnected)
  const progress = Math.round((completed.length / lessons.length) * 100)

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)) }, [completed])
  useEffect(() => { setDemoMessage('') }, [activeId])

  const completeLesson = () => {
    setCompleted((items) => items.includes(activeId) ? items : [...items, activeId])
    if (activeId < lessons.length) setActiveId(activeId + 1)
  }

  const highlight = () => {
    if (lesson.id === 7) { setLabTab('network'); setMode('physical'); scrollToSection('laboratory'); return }
    if (lesson.id === 8) { scrollToSection('data-flow'); return }
    const component: ComponentId = lesson.id === 3 ? 'led-red' : lesson.id === 4 ? 'relay' : lesson.id === 5 || lesson.id === 6 ? 'sht31' : 'esp32'
    selectComponent(component)
    setMode(lesson.id === 2 ? 'mapping' : 'physical')
    setCamera(lesson.id === 4 ? 'relay' : lesson.id === 5 || lesson.id === 6 ? 'sensor' : 'esp32')
    if (lesson.id === 5) highlightPin(21)
    scrollToSection('laboratory')
  }

  const runDemo = () => {
    if (lesson.id === 3) { toggleLed('red', 'physical'); setDemoMessage(`Red LED is now ${useSimulation.getState().leds.red ? 'ON · GPIO 25 HIGH' : 'OFF · GPIO 25 LOW'}.`) }
    else if (lesson.id === 4) { toggleRelay('physical'); setDemoMessage(`Relay energized: ${useSimulation.getState().relay}. NO is ${useSimulation.getState().relay ? 'closed' : 'open'}; NC is ${useSimulation.getState().relay ? 'open' : 'closed'}.`) }
    else if (lesson.id === 6) { tickSensor(); setDemoMessage(`New I²C sample: ${useSimulation.getState().sensor.temperature.toFixed(1)}°C and ${useSimulation.getState().sensor.humidity.toFixed(1)}% RH.`) }
    else if (lesson.id === 7) { setWifi(!useSimulation.getState().wifiConnected); setLabTab('network'); setDemoMessage(`Virtual client ${useSimulation.getState().wifiConnected ? 'connected to' : 'disconnected from'} ESP32-IOT.`) }
    else if (lesson.id === 2) { highlight(); setDemoMessage('Live GPIO pin map opened. Select any pin to trace its circuit.') }
    else { highlight(); setDemoMessage(lesson.id === 8 ? 'Run the LED control scenario to follow a request.' : 'Component highlighted on the interactive bench.') }
  }

  return (
    <section id="learn" className="relative py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading number="05" eyebrow="Guided learning center" title="Understand the system, one signal at a time." description="Eight focused lessons connect theory to the live bench. Run demonstrations, inspect highlighted components, and save your progress in this browser." action={<div className="min-w-[200px]"><div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider"><span className="text-slate-500">Course progress</span><span className="text-cyan">{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-cyan shadow-[0_0_10px_#62e9ff66]" /></div><p className="mt-2 text-right font-mono text-[8px] text-slate-600">{completed.length} OF {lessons.length} LESSONS COMPLETE</p></div>} />
        <div className="grid gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
          <div className="panel overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/[0.07] px-5 py-4"><BookOpen size={14} className="text-cyan" /><span className="metric-label">ESP32 fundamentals</span></div>
            <div className="max-h-[720px] overflow-y-auto p-2">
              {lessons.map((item) => <button key={item.id} onClick={() => setActiveId(item.id)} className={`group mb-1 flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${activeId === item.id ? 'border-cyan/20 bg-cyan/[0.055]' : 'border-transparent hover:bg-white/[0.025]'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-[9px] ${completed.includes(item.id) ? 'border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300' : activeId === item.id ? 'border-cyan/25 text-cyan' : 'border-white/[0.08] text-slate-600'}`}>{completed.includes(item.id) ? <Check size={13} /> : String(item.id).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className={`block text-[11px] font-medium leading-5 ${activeId === item.id ? 'text-white' : 'text-slate-400'}`}>{item.title}</span><span className="mt-0.5 block font-mono text-[7px] uppercase tracking-wider text-slate-600">{item.eyebrow}</span></span><ChevronRight size={13} className={activeId === item.id ? 'text-cyan' : 'text-slate-700'} /></button>)}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.article key={lesson.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="p-5 sm:p-7 lg:p-8">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><p className="eyebrow">Lesson {String(lesson.id).padStart(2, '0')} · {lesson.eyebrow}</p><h3 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h3></div>{completed.includes(lesson.id) && <span className="chip !border-emerald-400/20 !text-emerald-300"><CheckCircle2 size={11} />Completed</span>}</div>
                <p className="mt-4 text-sm font-medium leading-7 text-slate-300">{lesson.summary}</p>
                <div className="mt-6"><LessonVisual lessonId={lesson.id} /></div>
                <p className="mt-6 text-sm leading-7 text-slate-400">{lesson.explanation}</p>
                <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"><p className="metric-label mb-4">Key takeaways</p><ul className="grid gap-3 lg:grid-cols-3">{lesson.keyTakeaways.map((takeaway) => <li key={takeaway} className="flex gap-2 text-[11px] leading-5 text-slate-400"><Check size={13} className="mt-0.5 shrink-0 text-cyan" />{takeaway}</li>)}</ul></div>
                <AnimatePresence>{demoMessage && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden"><p className="mt-4 rounded-lg border border-cyan/15 bg-cyan/[0.04] px-4 py-3 font-mono text-[10px] leading-5 text-cyan">{demoMessage}</p></motion.div>}</AnimatePresence>
                <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center"><button onClick={runDemo} className="btn-primary"><Play size={13} />{lesson.demoLabel}</button><button onClick={highlight} className="btn-secondary"><Crosshair size={13} />{lesson.id === 7 ? 'Open network lab' : lesson.id === 8 ? 'Open data flow' : 'Highlight component'}</button><button onClick={completeLesson} className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-slate-500 transition hover:text-cyan sm:ml-auto sm:mt-0">{completed.includes(lesson.id) ? <Circle size={12} /> : <Trophy size={12} />}{completed.includes(lesson.id) ? 'Review next lesson' : 'Mark complete'}<ArrowRight size={12} /></button></div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
