import { describe, expect, it } from 'vitest'
import { clamp, createInitialHistory, nextSensorReading } from './simulation'

describe('sensor simulation', () => {
  it('clamps environmental limits', () => {
    expect(clamp(50, 20, 40)).toBe(40)
    expect(clamp(10, 20, 40)).toBe(20)
  })

  it('moves naturally toward the target without abrupt jumps', () => {
    const current = { temperature: 28, humidity: 60, timestamp: 0 }
    const next = nextSensorReading(current, 35, 80, 1000, () => 0.5)
    expect(next.temperature).toBeGreaterThan(28)
    expect(next.temperature).toBeLessThan(29)
    expect(next.humidity).toBeGreaterThan(60)
    expect(next.humidity).toBeLessThan(62)
    expect(next.timestamp).toBe(1000)
  })

  it('creates ordered historical readings', () => {
    const history = createInitialHistory(100000)
    expect(history).toHaveLength(24)
    expect(history[23].timestamp).toBe(100000)
    expect(history[0].timestamp).toBe(77000)
  })
})
