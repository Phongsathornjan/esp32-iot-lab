import { Activity, Droplets, RotateCcw, Thermometer } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts'
import { useSimulation } from '../../store/useSimulation'
import { StatusDot } from '../ui/StatusDot'

const timeLabel = (timestamp: number) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

function MiniChart({ type }: { type: 'temperature' | 'humidity' }) {
  const history = useSimulation((state) => state.history)
  const temperature = type === 'temperature'
  const color = temperature ? '#62e9ff' : '#9b8cff'
  return (
    <div className="mt-2 h-[68px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history.slice(-24)} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={temperature ? [20, 40] : [30, 90]} />
          <Tooltip contentStyle={{ background: '#0b101c', border: '1px solid #283348', borderRadius: 8, fontSize: 10, fontFamily: 'JetBrains Mono' }} labelFormatter={(value) => timeLabel(Number(value))} formatter={(value) => [`${Number(value).toFixed(1)}${temperature ? '°C' : '%'}`, temperature ? 'Temperature' : 'Humidity']} />
          <Line type="monotone" dataKey={type} stroke={color} strokeWidth={1.6} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function TelemetryPanel() {
  const sensor = useSimulation((state) => state.sensor)
  const history = useSimulation((state) => state.history)
  const targetTemperature = useSimulation((state) => state.targetTemperature)
  const targetHumidity = useSimulation((state) => state.targetHumidity)
  const setEnvironment = useSimulation((state) => state.setEnvironment)

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">SHT31 live telemetry</p>
          <h3 className="mt-1 font-display text-base font-semibold">Live IoT Dashboard</h3>
        </div>
        <div className="text-right">
          <span className="flex items-center justify-end gap-1.5 font-mono text-[8px] uppercase tracking-wider text-emerald-300"><StatusDot />Online</span>
          <p className="mt-1 font-mono text-[7px] text-slate-600">{timeLabel(sensor.timestamp)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(['temperature', 'humidity'] as const).map((type) => {
          const temperature = type === 'temperature'
          const value = temperature ? sensor.temperature : sensor.humidity
          return (
            <div key={type} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <p className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-wider text-slate-500">{temperature ? <Thermometer size={11} className="text-cyan" /> : <Droplets size={11} className="text-violet" />}{temperature ? 'Temperature' : 'Humidity'}</p>
              <p className={`mt-2 font-display text-[26px] font-medium leading-none ${temperature ? 'text-white' : 'text-white'}`}>{value.toFixed(1)}<span className={`ml-1 font-mono text-[9px] ${temperature ? 'text-cyan' : 'text-violet'}`}>{temperature ? '°C' : '% RH'}</span></p>
              <MiniChart type={type} />
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3">
        <div className="flex items-center justify-between">
          <p className="metric-label">Environment simulator</p>
          <button className="icon-button !h-6 !w-6" aria-label="Reset environment targets" onClick={() => setEnvironment(29, 64)}><RotateCcw size={11} /></button>
        </div>
        <div className="mt-3">
          <div className="flex justify-between font-mono text-[9px]"><span className="text-slate-500">Target temperature</span><span className="text-cyan">{targetTemperature.toFixed(1)}°C</span></div>
          <input className="mt-2 w-full" aria-label="Target temperature" type="range" min="20" max="40" step="0.5" value={targetTemperature} onChange={(event) => setEnvironment(Number(event.target.value), targetHumidity)} />
        </div>
        <div className="mt-4">
          <div className="flex justify-between font-mono text-[9px]"><span className="text-slate-500">Target humidity</span><span className="text-violet">{targetHumidity.toFixed(0)}%</span></div>
          <input className="mt-2 w-full" aria-label="Target humidity" type="range" min="30" max="90" step="1" value={targetHumidity} onChange={(event) => setEnvironment(targetTemperature, Number(event.target.value))} />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.07] bg-[#070b13]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
          <span className="font-mono text-[8px] uppercase tracking-wider text-slate-500">Latest samples</span>
          <span className="flex items-center gap-1 font-mono text-[7px] text-emerald-400"><Activity size={9} />1 HZ</span>
        </div>
        {[...history].reverse().slice(0, 4).map((reading) => (
          <div key={reading.timestamp} className="grid grid-cols-[1fr_56px_56px] border-b border-white/[0.04] px-3 py-2 font-mono text-[8px] last:border-0">
            <span className="text-slate-600">{timeLabel(reading.timestamp)}</span>
            <span className="text-right text-cyan">{reading.temperature.toFixed(1)}°</span>
            <span className="text-right text-violet">{reading.humidity.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
