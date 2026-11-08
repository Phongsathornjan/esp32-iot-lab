import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { CameraPreset, CircuitMode, ComponentId, LedKey } from '../data/circuit'
import { createInitialHistory, nextSensorReading } from '../lib/simulation'
import type { SensorReading } from '../lib/simulation'

export type ControlSource = 'remote' | 'physical'
export type TrafficStage = 'red' | 'yellow' | 'green'
export type LabTab = 'led' | 'dashboard' | 'relay' | 'network'

const componentTab: Partial<Record<ComponentId, LabTab>> = {
  'led-red': 'led',
  'led-yellow': 'led',
  'led-green': 'led',
  'resistor-red': 'led',
  'resistor-yellow': 'led',
  'resistor-green': 'led',
  relay: 'relay',
  sht31: 'dashboard',
}

interface TrafficState {
  active: boolean
  stage: TrafficStage
  durations: Record<TrafficStage, number>
}

interface SimulationState {
  wifiConnected: boolean
  leds: Record<LedKey, boolean>
  relay: boolean
  sensor: SensorReading & { connected: boolean }
  targetTemperature: number
  targetHumidity: number
  history: SensorReading[]
  selectedComponent: ComponentId
  activeLabTab: LabTab
  highlightedPin: number | null
  circuitMode: CircuitMode
  cameraPreset: CameraPreset
  cameraNonce: number
  traffic: TrafficState
  setWifiConnected: (connected: boolean) => void
  toggleLed: (led: LedKey, source?: ControlSource) => void
  setAllLeds: (on: boolean) => void
  setRelay: (on: boolean, source?: ControlSource) => void
  toggleRelay: (source?: ControlSource) => void
  setEnvironment: (temperature: number, humidity: number) => void
  tickSensor: () => void
  selectComponent: (id: ComponentId) => void
  setLabTab: (tab: LabTab) => void
  highlightPin: (pin: number | null) => void
  setCircuitMode: (mode: CircuitMode) => void
  setCameraPreset: (preset: CameraPreset) => void
  startTraffic: () => void
  stopTraffic: () => void
  advanceTraffic: () => void
  setTrafficDuration: (stage: TrafficStage, seconds: number) => void
  resetSimulation: () => void
}

const initialLeds: Record<LedKey, boolean> = { red: false, yellow: false, green: true }
const initialTraffic: TrafficState = { active: false, stage: 'red', durations: { red: 3, yellow: 1, green: 3 } }
const firstHistory = createInitialHistory()

export const useSimulation = create<SimulationState>((set, get) => ({
  wifiConnected: true,
  leds: initialLeds,
  relay: false,
  sensor: { ...firstHistory[firstHistory.length - 1], connected: true },
  targetTemperature: 29,
  targetHumidity: 64,
  history: firstHistory,
  selectedComponent: 'esp32',
  activeLabTab: 'led',
  highlightedPin: null,
  circuitMode: 'physical',
  cameraPreset: 'overview',
  cameraNonce: 0,
  traffic: initialTraffic,

  setWifiConnected: (wifiConnected) => set({ wifiConnected }),
  toggleLed: (led, source = 'remote') => {
    if (source === 'remote' && !get().wifiConnected) return
    set((state) => ({
      leds: { ...state.leds, [led]: !state.leds[led] },
      traffic: { ...state.traffic, active: false },
    }))
  },
  setAllLeds: (on) => {
    if (!get().wifiConnected) return
    set((state) => ({ leds: { red: on, yellow: on, green: on }, traffic: { ...state.traffic, active: false } }))
  },
  setRelay: (relay, source = 'remote') => {
    if (source === 'remote' && !get().wifiConnected) return
    set({ relay })
  },
  toggleRelay: (source = 'remote') => get().setRelay(!get().relay, source),
  setEnvironment: (targetTemperature, targetHumidity) => set({ targetTemperature, targetHumidity }),
  tickSensor: () => set((state) => {
    const reading = nextSensorReading(state.sensor, state.targetTemperature, state.targetHumidity)
    return { sensor: { ...reading, connected: true }, history: [...state.history, reading].slice(-40) }
  }),
  selectComponent: (selectedComponent) => set((state) => ({
    selectedComponent,
    activeLabTab: componentTab[selectedComponent] ?? state.activeLabTab,
  })),
  setLabTab: (activeLabTab) => set({ activeLabTab }),
  highlightPin: (highlightedPin) => set({ highlightedPin }),
  setCircuitMode: (circuitMode) => set({ circuitMode }),
  setCameraPreset: (cameraPreset) => set((state) => ({ cameraPreset, cameraNonce: state.cameraNonce + 1 })),
  startTraffic: () => {
    if (!get().wifiConnected) return
    set((state) => ({
      leds: { red: true, yellow: false, green: false },
      traffic: { ...state.traffic, active: true, stage: 'red' },
    }))
  },
  stopTraffic: () => set((state) => ({ traffic: { ...state.traffic, active: false } })),
  advanceTraffic: () => set((state) => {
    if (!state.traffic.active) return state
    const next: Record<TrafficStage, TrafficStage> = { red: 'yellow', yellow: 'green', green: 'red' }
    const stage = next[state.traffic.stage]
    return {
      traffic: { ...state.traffic, stage },
      leds: { red: stage === 'red', yellow: stage === 'yellow', green: stage === 'green' },
    }
  }),
  setTrafficDuration: (stage, seconds) => set((state) => ({
    traffic: { ...state.traffic, durations: { ...state.traffic.durations, [stage]: seconds } },
  })),
  resetSimulation: () => set({
    leds: initialLeds,
    relay: false,
    targetTemperature: 29,
    targetHumidity: 64,
    traffic: initialTraffic,
    highlightedPin: null,
  }),
}))

export const useGPIO = () => useSimulation(useShallow((state) => ({
  25: state.leds.red,
  26: state.leds.yellow,
  27: state.leds.green,
  23: state.relay,
})))
