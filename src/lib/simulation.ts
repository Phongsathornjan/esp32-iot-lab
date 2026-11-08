export interface SensorReading {
  temperature: number
  humidity: number
  timestamp: number
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function nextSensorReading(
  current: SensorReading,
  targetTemperature: number,
  targetHumidity: number,
  timestamp = Date.now(),
  random: () => number = Math.random,
): SensorReading {
  const drift = Math.sin(timestamp / 9000) * 0.018
  const temperature = clamp(
    current.temperature + (targetTemperature - current.temperature) * 0.055 + drift + (random() - 0.5) * 0.12,
    20,
    40,
  )
  const humidity = clamp(
    current.humidity + (targetHumidity - current.humidity) * 0.045 - drift * 0.7 + (random() - 0.5) * 0.24,
    30,
    90,
  )
  return {
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity * 10) / 10,
    timestamp,
  }
}

export function createInitialHistory(now = Date.now()): SensorReading[] {
  return Array.from({ length: 24 }, (_, index) => ({
    temperature: Math.round((27.8 + Math.sin(index / 3.4) * 0.7) * 10) / 10,
    humidity: Math.round((61.5 + Math.cos(index / 4.2) * 2.1) * 10) / 10,
    timestamp: now - (23 - index) * 1000,
  }))
}
