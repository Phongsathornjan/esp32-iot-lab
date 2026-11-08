export type LedKey = 'red' | 'yellow' | 'green'
export type ComponentId =
  | 'esp32'
  | 'led-red'
  | 'led-yellow'
  | 'led-green'
  | 'resistor-red'
  | 'resistor-yellow'
  | 'resistor-green'
  | 'relay'
  | 'sht31'
  | 'breadboard'

export type CircuitMode = 'physical' | 'diagram' | 'mapping'
export type CameraPreset = 'overview' | 'top' | 'front' | 'esp32' | 'sensor' | 'relay'

export interface ComponentInfo {
  id: ComponentId
  name: string
  shortName: string
  category: string
  purpose: string
  specifications: string[]
  connections: string[]
}

export const componentInfo: Record<ComponentId, ComponentInfo> = {
  esp32: {
    id: 'esp32', name: 'ESP32 DevKit V1', shortName: 'ESP32', category: 'MAIN CONTROLLER',
    purpose: 'A dual-core microcontroller that reads the SHT31 over I²C, controls GPIO outputs, and hosts the local Wi-Fi access point and web dashboard.',
    specifications: ['3.3V logic', 'Dual-core Xtensa LX6', '2.4 GHz Wi-Fi + Bluetooth', '30-pin DevKit V1'],
    connections: ['GPIO 25 / 26 / 27 → LED signals', 'GPIO 23 → Relay module IN', 'GPIO 21 / 22 → I²C SDA / SCL'],
  },
  'led-red': ledInfo('led-red', 'Red LED', 25, 'red'),
  'led-yellow': ledInfo('led-yellow', 'Yellow LED', 26, 'yellow'),
  'led-green': ledInfo('led-green', 'Green LED', 27, 'green'),
  'resistor-red': resistorInfo('resistor-red', 'Red LED resistor', 25),
  'resistor-yellow': resistorInfo('resistor-yellow', 'Yellow LED resistor', 26),
  'resistor-green': resistorInfo('resistor-green', 'Green LED resistor', 27),
  relay: {
    id: 'relay', name: '5V Relay Module', shortName: 'Relay', category: 'POWER SWITCHING',
    purpose: 'An electrically isolated switch. GPIO 23 drives only the module input; a suitable 5V supply powers the relay circuit. The ESP32 never powers the coil from a GPIO pin.',
    specifications: ['5V DC module supply', '3.3V-compatible logic input', 'COM / NO / NC contacts', 'Common ground with ESP32'],
    connections: ['IN ← GPIO 23 (control only)', 'VCC ← regulated 5V supply', 'GND → common ground'],
  },
  sht31: {
    id: 'sht31', name: 'SHT31 Sensor', shortName: 'SHT31', category: 'ENVIRONMENTAL SENSOR',
    purpose: 'A calibrated digital temperature and relative-humidity sensor. The ESP32 requests readings using the I²C bus.',
    specifications: ['−40 to 125°C range', '0–100% RH range', 'I²C address 0x44', '2.4–5.5V supply'],
    connections: ['SDA ↔ GPIO 21', 'SCL ↔ GPIO 22', 'VIN ← 3.3V', 'GND → common ground'],
  },
  breadboard: {
    id: 'breadboard', name: 'Solderless Breadboard', shortName: 'Breadboard', category: 'PROTOTYPING',
    purpose: 'Reusable internal spring clips connect components without soldering. The outer rails distribute supply and ground.',
    specifications: ['830 tie points', 'Dual power rails', 'ABS housing', 'Reusable spring contacts'],
    connections: ['Red rail → regulated supply', 'Blue rail → common ground', 'Terminal strips → components'],
  },
}

function ledInfo(id: ComponentId, name: string, gpio: number, color: string): ComponentInfo {
  return {
    id, name, shortName: name.replace(' LED', ''), category: 'GPIO OUTPUT',
    purpose: `A ${color} indicator driven by GPIO ${gpio}. HIGH applies approximately 3.3V through a current-limiting resistor; LOW turns it off.`,
    specifications: ['2.0–2.2V forward voltage', '5–15mA typical current', '220Ω series resistor', `GPIO ${gpio} digital output`],
    connections: [`Anode ← GPIO ${gpio} via 220Ω`, 'Cathode → GND', `HIGH / LOW follows GPIO ${gpio}`],
  }
}

function resistorInfo(id: ComponentId, name: string, gpio: number): ComponentInfo {
  return {
    id, name, shortName: '220Ω', category: 'CURRENT LIMITING',
    purpose: 'Limits LED current to protect both the LED and the ESP32 output pin. It must be connected in series with the LED.',
    specifications: ['220Ω resistance', '±5% tolerance', '0.25W rating', 'Red–red–brown–gold bands'],
    connections: [`One lead ← GPIO ${gpio}`, 'Other lead → LED anode', 'Not polarized'],
  }
}

export const pinMapping = [
  { pin: 25, label: 'Red LED signal', component: 'led-red' as ComponentId, color: '#f6c453', role: 'DIGITAL OUT' },
  { pin: 26, label: 'Yellow LED signal', component: 'led-yellow' as ComponentId, color: '#ff963e', role: 'DIGITAL OUT' },
  { pin: 27, label: 'Green LED signal', component: 'led-green' as ComponentId, color: '#57e39a', role: 'DIGITAL OUT' },
  { pin: 23, label: 'Relay IN', component: 'relay' as ComponentId, color: '#ae86ff', role: 'DIGITAL OUT' },
  { pin: 21, label: 'SHT31 SDA', component: 'sht31' as ComponentId, color: '#58a6ff', role: 'I²C DATA' },
  { pin: 22, label: 'SHT31 SCL', component: 'sht31' as ComponentId, color: '#3884e8', role: 'I²C CLOCK' },
]

export const cameraPresets: { id: CameraPreset; label: string; position: [number, number, number]; target: [number, number, number] }[] = [
  { id: 'overview', label: 'Overview', position: [8.5, 7.5, 11], target: [0, 0, 0] },
  { id: 'top', label: 'Top view', position: [0, 17, 0.01], target: [0, 0, 0] },
  { id: 'front', label: 'Front view', position: [0, 3, 17], target: [0, 0, 0] },
  { id: 'esp32', label: 'ESP32 close-up', position: [-5, 4, 5], target: [-3.8, 0.3, 0] },
  { id: 'sensor', label: 'Sensor close-up', position: [5, 3.5, -1], target: [3.4, 0.3, -2.5] },
  { id: 'relay', label: 'Relay close-up', position: [7, 4, 5], target: [4.5, 0.4, 1.5] },
]
