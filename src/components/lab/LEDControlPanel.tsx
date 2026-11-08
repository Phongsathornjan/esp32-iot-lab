import { motion } from 'framer-motion'
import { CircleStop, Lightbulb, Play, RotateCw, WifiOff } from 'lucide-react'
import { useSimulation } from '../../store/useSimulation'
import type { TrafficStage } from '../../store/useSimulation'
import type { LedKey } from '../../data/circuit'
import { Toggle } from '../ui/Toggle'

const ledConfig: { id: LedKey; gpio: number; color: string }[] = [
  { id: 'red', gpio: 25, color: '#ff5263' },
  { id: 'yellow', gpio: 26, color: '#ffc85a' },
  { id: 'green', gpio: 27, color: '#57e39a' },
]

export function LEDControlPanel() {
  const leds = useSimulation((state) => state.leds)
  const connected = useSimulation((state) => state.wifiConnected)
  const toggle = useSimulation((state) => state.toggleLed)
  const setAll = useSimulation((state) => state.setAllLeds)
  const traffic = useSimulation((state) => state.traffic)
  const startTraffic = useSimulation((state) => state.startTraffic)
  const stopTraffic = useSimulation((state) => state.stopTraffic)
  const setDuration = useSimulation((state) => state.setTrafficDuration)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="metric-label">Digital outputs</p>
          <h3 className="mt-1 font-display text-base font-semibold">LED Control</h3>
        </div>
        <span className="chip"><span className="h-1 w-1 rounded-full bg-cyan" />3 channels</span>
      </div>
      {!connected && <div className="flex items-center gap-2 rounded-lg border border-amber-400/15 bg-amber-400/[0.04] px-3 py-2.5 font-mono text-[9px] text-amber-200/70"><WifiOff size={13} />Connect to ESP32-IOT to unlock remote control.</div>}

      <div className="space-y-2">
        {ledConfig.map((led) => (
          <div key={led.id} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <motion.div
              animate={leds[led.id] ? { boxShadow: [`0 0 0 ${led.color}00`, `0 0 22px ${led.color}55`, `0 0 12px ${led.color}33`] } : { boxShadow: '0 0 0 transparent' }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
              style={{ borderColor: `${led.color}35`, backgroundColor: `${led.color}${leds[led.id] ? '20' : '08'}`, color: led.color }}
            >
              <Lightbulb size={17} />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium capitalize text-slate-200">{led.id} LED</p>
              <div className="mt-1 flex items-center gap-2 font-mono text-[8px]">
                <span className="text-slate-600">GPIO {led.gpio}</span>
                <span className="text-slate-700">/</span>
                <span style={{ color: leds[led.id] ? led.color : '#64748b' }}>{leds[led.id] ? 'HIGH · ON' : 'LOW · OFF'}</span>
              </div>
            </div>
            <Toggle checked={leds[led.id]} onChange={() => toggle(led.id)} label={`${led.id} LED`} disabled={!connected} color={led.color} />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button disabled={!connected} onClick={() => setAll(true)} className="btn-secondary flex-1 !py-2.5">All ON</button>
        <button disabled={!connected} onClick={() => setAll(false)} className="btn-secondary flex-1 !py-2.5">All OFF</button>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium text-slate-200"><RotateCw size={13} className={traffic.active ? 'animate-spin text-cyan' : 'text-slate-500'} />Traffic sequence</p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-wider text-slate-600">Red → Yellow → Green</p>
          </div>
          <button disabled={!connected} onClick={traffic.active ? stopTraffic : startTraffic} className={`${traffic.active ? 'btn-secondary' : 'btn-primary'} !px-3 !py-2`}>
            {traffic.active ? <><CircleStop size={12} />Stop sequence</> : <><Play size={12} />Start sequence</>}
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(['red', 'yellow', 'green'] as TrafficStage[]).map((stage) => (
            <label key={stage} className={`rounded-lg border p-2 transition ${traffic.active && traffic.stage === stage ? 'border-cyan/30 bg-cyan/[0.05]' : 'border-white/[0.06] bg-[#070b13]'}`}>
              <span className="flex items-center justify-between font-mono text-[8px] capitalize text-slate-400">
                <span className="flex items-center gap-1"><i className={`h-1.5 w-1.5 rounded-full ${traffic.active && traffic.stage === stage ? 'live-dot' : ''}`} style={{ backgroundColor: ledConfig.find((item) => item.id === stage)?.color }} />{stage}</span>
              </span>
              <span className="mt-1.5 flex items-center gap-1">
                <input aria-label={`${stage} duration in seconds`} className="field w-full !px-1.5 !py-1 font-mono !text-[9px]" type="number" min="1" max="10" step="1" value={traffic.durations[stage]} onChange={(event) => setDuration(stage, Math.min(10, Math.max(1, Number(event.target.value))))} />
                <span className="font-mono text-[7px] text-slate-600">s</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <p className="font-mono text-[8px] leading-4 text-slate-600">OUTPUTS UPDATE THE 3D LEDs AND GPIO BUS IN REAL TIME.</p>
    </div>
  )
}
