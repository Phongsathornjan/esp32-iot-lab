import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Grid, OrbitControls } from '@react-three/drei'
import { useInView } from 'framer-motion'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { Breadboard, ESP32Board, JumperWire, LED, RelayModule, Resistor, SHT31Sensor } from './Hardware'
import { cameraPresets, pinMapping } from '../../data/circuit'
import type { ComponentId, LedKey } from '../../data/circuit'
import { useSimulation } from '../../store/useSimulation'

const ledPositions: Record<LedKey, [number, number, number]> = {
  red: [-1.35, 0.54, 0.2],
  yellow: [0, 0.54, 0.2],
  green: [1.35, 0.54, 0.2],
}
const resistorPositions: Record<LedKey, [number, number, number]> = {
  red: [-1.35, 0.54, 1.7],
  yellow: [0, 0.54, 1.7],
  green: [1.35, 0.54, 1.7],
}
const wireRoutes = [
  { pin: 25, component: 'led-red' as ComponentId, color: '#f6c453', points: [[-3.32, 0.58, -1], [-2.65, 1.45, -1], [-2.25, 1.3, 1.7], [-1.78, 0.85, 1.7]] as [number, number, number][] },
  { pin: 26, component: 'led-yellow' as ComponentId, color: '#ff963e', points: [[-3.32, 0.58, -0.68], [-2.4, 1.65, -0.5], [-1.1, 1.5, 2.05], [-0.43, 0.85, 1.7]] as [number, number, number][] },
  { pin: 27, component: 'led-green' as ComponentId, color: '#57e39a', points: [[-3.32, 0.58, -0.36], [-2.25, 1.85, 0], [0.5, 1.65, 2.35], [0.92, 0.85, 1.7]] as [number, number, number][] },
  { pin: 23, component: 'relay' as ComponentId, color: '#ae86ff', points: [[-3.32, 0.58, 0.12], [-2.5, 1.75, 2.75], [2.65, 1.45, 2.55], [3.48, 0.57, 0.4]] as [number, number, number][] },
  { pin: 21, component: 'sht31' as ComponentId, color: '#58a6ff', points: [[-3.32, 0.58, 0.48], [-2.55, 1.55, -2.25], [2.5, 1.2, -3.25], [3.12, 0.48, -2.82]] as [number, number, number][] },
  { pin: 22, component: 'sht31' as ComponentId, color: '#3884e8', points: [[-3.32, 0.58, 0.8], [-2.35, 1.35, -2.65], [2.8, 1.05, -3.5], [3.5, 0.48, -2.82]] as [number, number, number][] },
]
const powerRoutes = [
  { component: 'relay' as ComponentId, color: '#ef4444', points: [[1.8, 0.58, 2.2], [2.35, 0.85, 3.25], [3.25, 0.7, 2.6], [3.9, 0.52, 0.4]] as [number, number, number][] },
  { component: 'sht31' as ComponentId, color: '#ef4444', points: [[-1.8, 0.58, -0.8], [-1.4, 0.95, -3.65], [2.7, 0.85, -3.65], [3.69, 0.48, -2.82]] as [number, number, number][] },
  { component: 'breadboard' as ComponentId, color: '#17191f', points: [[-3.32, 0.58, 1.15], [-2.75, 0.9, 2.9], [-1.9, 0.58, 2.2]] as [number, number, number][] },
  { component: 'relay' as ComponentId, color: '#17191f', points: [[1.55, 0.58, 2.2], [2.2, 0.65, 3.45], [3.6, 0.65, 2.7], [4.12, 0.52, 0.4]] as [number, number, number][] },
]

function CameraRig() {
  const controls = useRef<OrbitControlsType>(null)
  const preset = useSimulation((state) => state.cameraPreset)
  const nonce = useSimulation((state) => state.cameraNonce)
  const destination = useRef(new THREE.Vector3(...cameraPresets[0].position))
  const target = useRef(new THREE.Vector3(...cameraPresets[0].target))
  const transitioning = useRef(true)

  useEffect(() => {
    const config = cameraPresets.find((item) => item.id === preset) ?? cameraPresets[0]
    destination.current.set(...config.position)
    target.current.set(...config.target)
    transitioning.current = true
  }, [preset, nonce])

  useFrame(({ camera }) => {
    if (!controls.current || !transitioning.current) return
    camera.position.lerp(destination.current, 0.075)
    controls.current.target.lerp(target.current, 0.075)
    controls.current.update()
    if (camera.position.distanceTo(destination.current) < 0.015) transitioning.current = false
  })

  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.07} minDistance={3} maxDistance={26} maxPolarAngle={Math.PI / 2.04} onStart={() => { transitioning.current = false }} />
}

function PinHotspots() {
  const highlighted = useSimulation((state) => state.highlightedPin)
  const highlight = useSimulation((state) => state.highlightPin)
  const select = useSimulation((state) => state.selectComponent)
  return (
    <group position={[-4.2, 0.2, -0.2]}>
      {pinMapping.map((pin, index) => (
        <group key={pin.pin} position={[0.9, 0.39, -1.05 + index * 0.35]}>
          <mesh
            onClick={(event) => { event.stopPropagation(); select(pin.component); highlight(pin.pin) }}
            onPointerOver={(event) => { event.stopPropagation(); highlight(pin.pin) }}
            onPointerOut={() => highlight(null)}
          >
            <sphereGeometry args={[highlighted === pin.pin ? 0.105 : 0.072, 14, 10]} />
            <meshStandardMaterial color={pin.color} emissive={pin.color} emissiveIntensity={highlighted === pin.pin ? 3 : 0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bench({ onHover }: { onHover: (label: string | null) => void }) {
  const leds = useSimulation((state) => state.leds)
  const relay = useSimulation((state) => state.relay)
  const selected = useSimulation((state) => state.selectedComponent)
  const highlightedPin = useSimulation((state) => state.highlightedPin)
  const select = useSimulation((state) => state.selectComponent)
  const highlight = useSimulation((state) => state.highlightPin)
  const choose = (id: ComponentId) => () => select(id)

  return (
    <group position={[0, 0.05, 0]}>
      <group position={[-4.2, 0.2, -0.2]}><ESP32Board selected={selected === 'esp32'} onSelect={choose('esp32')} label="ESP32 DevKit V1 · Main controller" onHover={onHover} /></group>
      <PinHotspots />
      <group position={[0, 0.18, 0.7]}><Breadboard selected={selected === 'breadboard'} onSelect={choose('breadboard')} label="830-point solderless breadboard" onHover={onHover} /></group>
      {(Object.keys(ledPositions) as LedKey[]).map((led) => (
        <group key={led}>
          <group position={ledPositions[led]} scale={0.66}><LED color={led} on={leds[led]} selected={selected === `led-${led}`} onSelect={choose(`led-${led}`)} label={`${led[0].toUpperCase() + led.slice(1)} LED · GPIO ${led === 'red' ? 25 : led === 'yellow' ? 26 : 27}`} onHover={onHover} /></group>
          <group position={resistorPositions[led]} scale={0.38}><Resistor selected={selected === `resistor-${led}`} onSelect={choose(`resistor-${led}`)} label={`220Ω current-limiting resistor · ${led} LED`} onHover={onHover} /></group>
        </group>
      ))}
      <group position={[4.2, 0.2, 1.1]}><RelayModule on={relay} selected={selected === 'relay'} onSelect={choose('relay')} label="5V Relay Module · GPIO 23 input" onHover={onHover} /></group>
      <group position={[3.4, 0.2, -2.4]}><SHT31Sensor selected={selected === 'sht31'} onSelect={choose('sht31')} label="SHT31 · I²C temperature & humidity" onHover={onHover} /></group>
      {wireRoutes.map((wire) => <JumperWire key={wire.pin} points={wire.points} color={wire.color} highlighted={highlightedPin === wire.pin || selected === wire.component} onSelect={() => { select(wire.component); highlight(wire.pin) }} />)}
      {powerRoutes.map((wire, index) => <JumperWire key={index} points={wire.points} color={wire.color} highlighted={selected === wire.component} onSelect={choose(wire.component)} />)}
    </group>
  )
}

export function CircuitScene() {
  const container = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<string | null>(null)
  const inView = useInView(container, { amount: 0.05 })
  return (
    <div ref={container} className="relative h-[540px] w-full sm:h-[600px]" aria-label="Interactive 3D ESP32 circuit">
      <Canvas frameloop={inView ? 'always' : 'never'} shadows dpr={[1, 1.6]} camera={{ position: [8.5, 7.5, 11], fov: 42, near: 0.1, far: 100 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <color attach="background" args={['#070b13']} />
        <fog attach="fog" args={['#070b13', 18, 38]} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 10, 6]} intensity={2.3} color="#dceaff" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-far={30} />
        <pointLight position={[-6, 4, -3]} intensity={16} color="#357dff" distance={14} />
        <pointLight position={[6, 3, 3]} intensity={12} color="#7d4dff" distance={12} />
        <Bench onHover={setTooltip} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow><planeGeometry args={[50, 50]} /><meshStandardMaterial color="#070b12" roughness={0.95} /></mesh>
        <Grid position={[0, 0, 0]} args={[30, 30]} cellSize={0.6} cellThickness={0.5} cellColor="#142131" sectionSize={3} sectionThickness={0.7} sectionColor="#1b3448" fadeDistance={25} fadeStrength={1.5} infiniteGrid />
        <ContactShadows position={[0, 0.015, 0]} opacity={0.5} scale={24} blur={2.4} far={8} color="#000000" />
        <CameraRig />
      </Canvas>
      {tooltip && <div className="pointer-events-none absolute bottom-16 right-4 rounded-lg border border-cyan/25 bg-[#080d16]/95 px-3 py-2 shadow-glow backdrop-blur-md"><p className="font-mono text-[9px] font-medium text-white">{tooltip}</p><p className="mt-1 font-mono text-[7px] uppercase tracking-widest text-cyan">Click to inspect</p></div>}
      <div className="pointer-events-none absolute bottom-4 right-4 hidden flex-col items-end gap-1 font-mono text-[7px] tracking-wider sm:flex"><span className="rounded border border-red-400/20 bg-[#080d16]/90 px-2 py-1 text-red-300">5V SUPPLY → RELAY VCC</span><span className="rounded border border-blue-400/20 bg-[#080d16]/90 px-2 py-1 text-blue-300">I²C BUS · 0x44</span></div>
    </div>
  )
}
