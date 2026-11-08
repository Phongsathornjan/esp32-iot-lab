import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { ESP32Board, JumperWire, LED, RelayModule, SHT31Sensor } from './Hardware'
import type { ComponentId } from '../../data/circuit'
import { useSimulation } from '../../store/useSimulation'

const heroWires: { points: [number, number, number][]; color: string }[] = [
  { points: [[0.6, 0.1, 0.4], [1.4, 0.5, 1], [2.4, 0.1, 1.7]], color: '#9b8cff' },
  { points: [[-0.6, 0.1, 0.4], [-1.2, 0.7, 1], [-2.4, 0.1, 1.7]], color: '#f6c453' },
  { points: [[-0.6, 0.1, -0.6], [-1.3, 0.7, -1.3], [-2.4, 0.1, -1.8]], color: '#58a6ff' },
  { points: [[0.6, 0.1, -0.6], [1.4, 0.6, -1.2], [2.4, 0.1, -1.8]], color: '#57e39a' },
]

function Assembly({ onSelect }: { onSelect: (id: ComponentId) => void }) {
  const group = useRef<THREE.Group>(null)
  const leds = useSimulation((state) => state.leds)
  const relay = useSimulation((state) => state.relay)
  const { size } = useThree()
  const mobile = size.width < 768

  useFrame(({ pointer }) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.13 - 0.15, 0.035)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -pointer.y * 0.08 - 0.18, 0.035)
  })

  return (
    <group ref={group} position={[mobile ? 0 : 2.2, mobile ? -3 : 0, 0]} scale={mobile ? 0.55 : 1}>
      <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.35}>
        <group scale={1.05}><ESP32Board onSelect={() => onSelect('esp32')} label="ESP32 DevKit V1 · Click to explore" /></group>
      </Float>
      <Float speed={1.8} floatIntensity={0.55} position={[-2.5, 0, 1.8]}><group scale={0.7}><LED color="red" on={leds.red} onSelect={() => onSelect('led-red')} label="Red LED · GPIO 25" /></group></Float>
      <Float speed={1.5} floatIntensity={0.5} position={[2.55, -0.1, -1.8]}><group scale={0.7}><LED color="green" on={leds.green} onSelect={() => onSelect('led-green')} label="Green LED · GPIO 27" /></group></Float>
      <Float speed={1.65} floatIntensity={0.55} position={[2.65, -0.2, 1.8]}><group scale={0.62}><LED color="yellow" on={leds.yellow} onSelect={() => onSelect('led-yellow')} label="Yellow LED · GPIO 26" /></group></Float>
      <Float speed={1.3} floatIntensity={0.45} position={[-2.55, -0.25, -1.8]}><group scale={0.85}><SHT31Sensor onSelect={() => onSelect('sht31')} label="SHT31 · I²C environmental sensor" /></group></Float>
      <Float speed={1.15} floatIntensity={0.4} position={[0, -0.7, 2.8]}><group scale={0.65}><RelayModule on={relay} onSelect={() => onSelect('relay')} label="5V Relay Module · COM / NO / NC" /></group></Float>
      {heroWires.map((wire, index) => <JumperWire key={index} points={wire.points} color={wire.color} highlighted />)}
      <Sparkles count={mobile ? 35 : 70} scale={[9, 5, 7]} size={1.3} speed={0.25} opacity={0.45} color="#62e9ff" />
    </group>
  )
}

export function HeroScene({ onSelect, active }: { onSelect: (id: ComponentId) => void; active: boolean }) {
  return (
    <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 2.3, 12], fov: 43 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 7, 5]} intensity={2.5} color="#d6e7ff" />
      <pointLight position={[4, 2, 2]} intensity={28} color="#614dff" distance={14} />
      <pointLight position={[-4, 1, 3]} intensity={22} color="#00bfff" distance={13} />
      <Assembly onSelect={onSelect} />
    </Canvas>
  )
}
