import { ArrowDownToLine, ArrowRight, Cable, CircuitBoard, Power, Waypoints } from 'lucide-react'
import { pinMapping } from '../data/circuit'
import { useSimulation } from '../store/useSimulation'
import { SectionHeading } from './ui/SectionHeading'
import { scrollToSection } from '../lib/navigation'

export function ConnectionSection() {
  const select = useSimulation((state) => state.selectComponent)
  const setMode = useSimulation((state) => state.setCircuitMode)
  const highlight = useSimulation((state) => state.highlightPin)
  const trace = (pin: number, component: typeof pinMapping[number]['component']) => { select(component); highlight(pin); setMode('diagram'); scrollToSection('laboratory') }

  return (
    <section id="connections" className="relative py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading number="03" eyebrow="Connection intelligence" title="Signal, power, and ground are not the same." description="Trace each GPIO assignment and understand the electrical role of every wire. The relay logic input is intentionally separated from its 5V module supply." action={<button onClick={() => { setMode('diagram'); scrollToSection('laboratory') }} className="btn-secondary"><CircuitBoard size={14} />Open full schematic</button>} />
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4"><span className="metric-label flex items-center gap-2"><Waypoints size={13} className="text-cyan" />ESP32 pin mapping</span><span className="font-mono text-[8px] text-slate-600">SELECT TO TRACE</span></div>
            <div>{pinMapping.map((pin) => <button key={pin.pin} onClick={() => trace(pin.pin, pin.component)} onMouseEnter={() => highlight(pin.pin)} onMouseLeave={() => highlight(null)} className="group grid w-full grid-cols-[76px_1fr_auto] items-center border-b border-white/[0.05] px-5 py-4 text-left transition last:border-0 hover:bg-white/[0.025] sm:grid-cols-[90px_1fr_140px_auto]"><span className="font-mono text-xs font-semibold" style={{ color: pin.color }}>GPIO {pin.pin}</span><span className="text-xs text-slate-300">{pin.label}</span><span className="hidden font-mono text-[8px] text-slate-600 sm:block">{pin.role}</span><ArrowRight size={13} className="ml-3 text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan" /></button>)}</div>
          </div>
          <div className="grid gap-3">
            {[{ icon: Cable, title: 'Signal wires', copy: 'Yellow, orange, green, and purple carry digital control. Blue routes I²C data and clock.', tag: 'LOW-CURRENT LOGIC', color: '#62e9ff' }, { icon: Power, title: 'Power rails', copy: 'Red wires distribute regulated 3.3V to the sensor and a suitable 5V supply to the relay module VCC.', tag: 'SUPPLY · NOT GPIO OUTPUT', color: '#ff5263' }, { icon: ArrowDownToLine, title: 'Common ground', copy: 'Black ground connections provide a shared electrical reference and a return path for the control circuit.', tag: '0V REFERENCE', color: '#94a3b8' }].map((item) => <div key={item.title} className="panel flex gap-4 p-5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]" style={{ color: item.color }}><item.icon size={18} /></div><div><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-medium text-slate-200">{item.title}</h3><span className="font-mono text-[7px] tracking-wider text-slate-600">{item.tag}</span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">{item.copy}</p></div></div>)}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-violet/15 bg-violet/[0.03] px-5 py-4 sm:flex-row sm:items-center"><span className="chip !border-violet/20 !text-violet">Important</span><p className="text-[11px] leading-5 text-slate-400"><strong className="font-medium text-slate-200">GPIO 23 → relay IN</strong> is a control signal only. The relay coil circuit is powered by the module’s 5V supply, not by an ESP32 output pin.</p></div>
      </div>
    </section>
  )
}
