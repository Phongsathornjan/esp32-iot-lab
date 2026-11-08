import type { ComponentId } from '../../data/circuit'
import { useSimulation } from '../../store/useSimulation'

const signalPaths = [
  { id: 'led-red' as ComponentId, pin: 25, d: 'M345 165 H455 V88 H620', color: '#f6c453', label: 'GPIO 25' },
  { id: 'led-yellow' as ComponentId, pin: 26, d: 'M345 195 H435 V178 H620', color: '#ff963e', label: 'GPIO 26' },
  { id: 'led-green' as ComponentId, pin: 27, d: 'M345 225 H415 V268 H620', color: '#57e39a', label: 'GPIO 27' },
  { id: 'relay' as ComponentId, pin: 23, d: 'M345 285 H460 V385 H620', color: '#ae86ff', label: 'GPIO 23 · IN' },
  { id: 'sht31' as ComponentId, pin: 21, d: 'M345 315 H400 V510 H620', color: '#58a6ff', label: 'GPIO 21 · SDA' },
  { id: 'sht31' as ComponentId, pin: 22, d: 'M345 345 H380 V535 H620', color: '#3884e8', label: 'GPIO 22 · SCL' },
]

export function CircuitDiagram() {
  const selected = useSimulation((state) => state.selectedComponent)
  const highlightedPin = useSimulation((state) => state.highlightedPin)
  const select = useSimulation((state) => state.selectComponent)
  const highlight = useSimulation((state) => state.highlightPin)
  const leds = useSimulation((state) => state.leds)
  const relay = useSimulation((state) => state.relay)

  const selectKey = (id: ComponentId, key: React.KeyboardEvent) => {
    if (key.key === 'Enter' || key.key === ' ') { key.preventDefault(); select(id) }
  }

  return (
    <div className="relative min-h-[540px] overflow-auto p-3 sm:p-6">
      <svg viewBox="0 0 1000 610" className="h-auto min-w-[850px] w-full" role="img" aria-label="ESP32 circuit connection schematic">
        <defs>
          <pattern id="schematic-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#182130" strokeWidth=".5" /></pattern>
          <filter id="wire-glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width="1000" height="610" rx="14" fill="#070b13" /><rect width="1000" height="610" rx="14" fill="url(#schematic-grid)" />
        <text x="35" y="38" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">CONNECTION SCHEMATIC · NOT TO SCALE</text>
        <g role="button" tabIndex={0} onClick={() => select('esp32')} onKeyDown={(e) => selectKey('esp32', e)} className="cursor-pointer">
          <rect x="85" y="105" width="260" height="310" rx="14" fill={selected === 'esp32' ? '#102433' : '#0d1420'} stroke={selected === 'esp32' ? '#62e9ff' : '#344154'} strokeWidth="1.5" />
          <rect x="125" y="140" width="180" height="100" rx="8" fill="#151f2c" stroke="#415069" /><text x="215" y="181" textAnchor="middle" fill="#edf3ff" fontSize="19" fontFamily="Space Grotesk" fontWeight="600">ESP32</text><text x="215" y="204" textAnchor="middle" fill="#718096" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="2">DEVKIT V1</text>
          <text x="215" y="278" textAnchor="middle" fill="#62e9ff" fontSize="9" fontFamily="JetBrains Mono">3.3V LOGIC</text>
          <text x="215" y="370" textAnchor="middle" fill="#718096" fontSize="10" fontFamily="JetBrains Mono">Wi-Fi AP · 192.168.4.1</text>
        </g>
        {signalPaths.map((path) => {
          const active = selected === path.id || highlightedPin === path.pin
          return <g key={`${path.pin}-${path.d}`} onClick={() => { select(path.id); highlight(path.pin) }} className="cursor-pointer"><path d={path.d} fill="none" stroke={path.color} strokeWidth={active ? 4 : 2} opacity={active ? 1 : .75} filter={active ? 'url(#wire-glow)' : undefined} /><circle cx="345" cy={path.d.match(/M345 (\d+)/)?.[1] ?? 0} r="4" fill={path.color} /><text x="365" y={Number(path.d.match(/M345 (\d+)/)?.[1] ?? 0) - 8} fill={path.color} fontSize="9" fontFamily="JetBrains Mono">{path.label}</text></g>
        })}
        {(['red', 'yellow', 'green'] as const).map((led, i) => {
          const id = `led-${led}` as ComponentId; const y = 88 + i * 90; const on = leds[led]; const color = led === 'red' ? '#ff5263' : led === 'yellow' ? '#ffc85a' : '#57e39a'
          return <g key={led} role="button" tabIndex={0} onClick={() => select(id)} onKeyDown={(e) => selectKey(id, e)} className="cursor-pointer"><rect x="620" y={y - 36} width="280" height="70" rx="10" fill={selected === id ? '#122332' : '#0d1420'} stroke={selected === id ? color : '#28354a'} /><circle cx="655" cy={y} r="12" fill={on ? color : '#192130'} stroke={color} opacity={on ? 1 : .7} /><text x="682" y={y - 4} fill="#dce7f7" fontSize="12" fontFamily="Inter">{led[0].toUpperCase() + led.slice(1)} LED</text><text x="682" y={y + 15} fill="#718096" fontSize="9" fontFamily="JetBrains Mono">220Ω SERIES RESISTOR</text><text x="870" y={y + 4} fill={on ? color : '#64748b'} textAnchor="end" fontSize="9" fontFamily="JetBrains Mono">{on ? 'HIGH · ON' : 'LOW · OFF'}</text></g>
        })}
        <g role="button" tabIndex={0} onClick={() => select('relay')} onKeyDown={(e) => selectKey('relay', e)} className="cursor-pointer"><rect x="620" y="345" width="280" height="88" rx="10" fill={selected === 'relay' ? '#19172c' : '#0d1420'} stroke={selected === 'relay' ? '#ae86ff' : '#344154'} /><text x="645" y="375" fill="#edf3ff" fontSize="13" fontFamily="Inter">5V Relay Module</text><text x="645" y="397" fill="#ae86ff" fontSize="9" fontFamily="JetBrains Mono">IN ← GPIO 23 ONLY</text><text x="870" y="416" textAnchor="end" fill={relay ? '#57e39a' : '#718096'} fontSize="9" fontFamily="JetBrains Mono">{relay ? 'ENERGIZED · NO CLOSED' : 'REST · NC CLOSED'}</text></g>
        <path d="M540 350 V365 H620" fill="none" stroke="#ff5263" strokeWidth="2.5" /><text x="520" y="341" textAnchor="middle" fill="#ff7885" fontSize="9" fontFamily="JetBrains Mono">5V SUPPLY → VCC</text>
        <path d="M540 410 V420 H620" fill="none" stroke="#64748b" strokeWidth="2" /><text x="510" y="432" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">COMMON GND</text>
        <g role="button" tabIndex={0} onClick={() => select('sht31')} onKeyDown={(e) => selectKey('sht31', e)} className="cursor-pointer"><rect x="620" y="475" width="280" height="90" rx="10" fill={selected === 'sht31' ? '#102433' : '#0d1420'} stroke={selected === 'sht31' ? '#58a6ff' : '#344154'} /><text x="645" y="504" fill="#edf3ff" fontSize="13" fontFamily="Inter">SHT31 Sensor</text><text x="645" y="526" fill="#58a6ff" fontSize="9" fontFamily="JetBrains Mono">I²C · ADDRESS 0x44</text><text x="645" y="546" fill="#718096" fontSize="9" fontFamily="JetBrains Mono">3.3V SUPPLY · COMMON GND</text></g>
        <path d="M790 88 H935 V565 H110 V415" fill="none" stroke="#536074" strokeWidth="1.5" strokeDasharray="5 5" /><text x="946" y="330" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono" transform="rotate(90 946 330)">COMMON GROUND RETURN</text>
      </svg>
      <div className="pointer-events-none absolute bottom-5 left-5 hidden rounded-lg border border-white/10 bg-[#080d16]/90 px-4 py-3 font-mono text-[9px] leading-5 text-slate-400 lg:block"><span className="text-red-400">RED</span> POWER &nbsp;·&nbsp; <span className="text-slate-300">GRAY</span> GROUND &nbsp;·&nbsp; <span className="text-violet">COLORED</span> SIGNAL</div>
    </div>
  )
}
