import { motion } from 'framer-motion'
import { Check, CircuitBoard, Cloud, Cpu, Lightbulb, Radio, Thermometer, Wifi, Zap } from 'lucide-react'
import { useSimulation } from '../store/useSimulation'

export function LessonVisual({ lessonId }: { lessonId: number }) {
  const leds = useSimulation((state) => state.leds)
  const relay = useSimulation((state) => state.relay)
  const sensor = useSimulation((state) => state.sensor)
  const wifi = useSimulation((state) => state.wifiConnected)
  const Icon = lessonId === 1 || lessonId === 2 ? Cpu : lessonId === 3 ? Lightbulb : lessonId === 4 ? Zap : lessonId === 5 ? CircuitBoard : lessonId === 6 ? Thermometer : lessonId === 7 ? Wifi : Cloud
  const title = lessonId === 1 ? 'ESP32 DEVKIT V1' : lessonId === 2 ? '3.3V DIGITAL LOGIC' : lessonId === 3 ? 'GPIO → 220Ω → LED → GND' : lessonId === 4 ? 'GPIO 23 → INPUT · 5V → VCC' : lessonId === 5 ? 'SDA 21 + SCL 22 · ADDRESS 0x44' : lessonId === 6 ? `${sensor.temperature.toFixed(1)}°C · ${sensor.humidity.toFixed(1)}% RH` : lessonId === 7 ? 'ESP32-IOT · 192.168.4.1' : 'REQUEST → PROCESS → RESPONSE'

  return (
    <div className="relative h-[230px] overflow-hidden rounded-xl border border-white/[0.07] bg-[#070b13] sm:h-[260px]">
      <div className="grid-bg absolute inset-0 opacity-70" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        {lessonId === 2 ? (
          <div className="relative grid w-full max-w-md grid-cols-2 gap-3">{[[25, leds.red, '#ff5263'], [26, leds.yellow, '#ffc85a'], [27, leds.green, '#57e39a'], [23, relay, '#ae86ff']].map(([pin, high, color]) => <div key={pin as number} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0c121e] px-4 py-3"><span className="font-mono text-[10px] text-slate-400">GPIO {pin as number}</span><span className="font-mono text-[9px]" style={{ color: high ? color as string : '#64748b' }}>{high ? 'HIGH · 3.3V' : 'LOW · 0V'}</span><span className={`h-2 w-2 rounded-full ${high ? 'live-dot' : ''}`} style={{ backgroundColor: high ? color as string : '#334155', color: color as string }} /></div>)}</div>
        ) : lessonId === 3 ? (
          <div className="flex items-center gap-4 sm:gap-7"><div className="text-center"><Cpu size={40} className="text-slate-400" /><p className="mt-2 font-mono text-[8px] text-slate-500">GPIO 25</p></div><FlowLine active={leds.red} /><div className="rounded border border-amber-200/30 bg-amber-100/10 px-4 py-2 font-mono text-[10px] text-amber-200">220Ω</div><FlowLine active={leds.red} /><motion.div animate={leds.red ? { filter: ['drop-shadow(0 0 5px #ff5263)', 'drop-shadow(0 0 20px #ff5263)', 'drop-shadow(0 0 5px #ff5263)'] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}><Lightbulb size={48} color={leds.red ? '#ff5263' : '#3b4658'} fill={leds.red ? '#ff526344' : 'transparent'} /></motion.div></div>
        ) : lessonId === 4 ? (
          <div className="relative flex w-full max-w-md items-center justify-between"><div className="text-center"><Cpu size={40} className="text-slate-400" /><p className="mt-2 font-mono text-[8px] text-violet">GPIO 23 · {relay ? 'HIGH' : 'LOW'}</p></div><FlowLine active={relay} color="#ae86ff" /><motion.div animate={{ borderColor: relay ? '#ae86ff' : '#344154', boxShadow: relay ? '0 0 25px #ae86ff22' : 'none' }} className="flex h-24 w-28 flex-col items-center justify-center rounded-xl border bg-[#111827]"><Zap size={27} className={relay ? 'text-violet' : 'text-slate-600'} /><p className="mt-2 font-mono text-[8px] text-slate-400">5V RELAY</p></motion.div><FlowLine active={relay} color="#57e39a" /><div className="text-center"><Lightbulb size={38} color={relay ? '#57e39a' : '#3b4658'} /><p className="mt-2 font-mono text-[8px] text-slate-500">{relay ? 'NO CLOSED' : 'NC CLOSED'}</p></div></div>
        ) : lessonId === 5 ? (
          <div className="w-full max-w-md"><div className="flex items-center justify-between"><Cpu size={42} className="text-cyan" /><Thermometer size={42} className="text-violet" /></div><div className="relative mt-5 space-y-4"><FlowLine active label="SDA · GPIO 21" /><FlowLine active label="SCL · GPIO 22" color="#3884e8" /></div><p className="mt-5 text-center font-mono text-[8px] text-slate-500">TWO SIGNAL WIRES · ONE SHARED BUS</p></div>
        ) : lessonId === 7 ? (
          <div className="flex items-center gap-8"><div className="text-center"><Radio size={44} className="text-cyan" /><p className="mt-2 font-mono text-[8px] text-slate-400">ESP32 AP</p></div><div className="relative h-24 w-24"><span className={`absolute inset-0 rounded-full border border-cyan/30 ${wifi ? 'signal-ring' : ''}`} /><span className={`absolute inset-3 rounded-full border border-cyan/40 ${wifi ? 'signal-ring' : ''}`} style={{ animationDelay: '-.7s' }} /><Wifi size={32} className={`absolute inset-0 m-auto ${wifi ? 'text-cyan' : 'text-slate-700'}`} /></div><div className="text-center"><Cloud size={44} className={wifi ? 'text-cyan' : 'text-slate-700'} /><p className="mt-2 font-mono text-[8px] text-slate-400">{wifi ? 'CLIENT CONNECTED' : 'DISCONNECTED'}</p></div></div>
        ) : lessonId === 8 ? (
          <div className="flex w-full max-w-lg items-center justify-between">{[[Cloud, 'DASHBOARD'], [Wifi, 'WI-FI'], [Cpu, 'ESP32'], [Lightbulb, 'GPIO']].map(([ItemIcon, label], index) => <div key={label as string} className="flex items-center gap-3 sm:gap-5"><div className="text-center"><ItemIcon size={30} className={index === 3 && leds.red ? 'text-red-400' : 'text-cyan'} /><p className="mt-2 font-mono text-[7px] text-slate-500">{label as string}</p></div>{index < 3 && <span className="hidden font-mono text-cyan sm:block">→</span>}</div>)}</div>
        ) : (
          <div className="relative text-center"><motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl border border-cyan/25 bg-cyan/[0.05] text-cyan shadow-glow"><Icon size={44} strokeWidth={1.3} /></motion.div>{lessonId === 6 && <div className="mt-4 flex justify-center gap-5 font-mono text-[9px]"><span className="text-cyan">TEMP {sensor.temperature.toFixed(1)}°C</span><span className="text-violet">RH {sensor.humidity.toFixed(1)}%</span></div>}</div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/[0.06] bg-[#080d16]/80 px-4 py-2.5 font-mono text-[8px] tracking-wider text-slate-500 backdrop-blur-sm"><span>{title}</span><span className="flex items-center gap-1 text-emerald-400"><Check size={10} />LIVE MODEL</span></div>
    </div>
  )
}

function FlowLine({ active, color = '#62e9ff', label }: { active: boolean; color?: string; label?: string }) {
  return <div className="relative h-5 min-w-10 flex-1"><div className="absolute left-0 right-0 top-1/2 h-px" style={{ backgroundColor: active ? color : '#334155' }} />{active && <motion.span animate={{ left: ['0%', '90%'], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.3 }} className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />}{label && <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] text-slate-500">{label}</span>}</div>
}
