import { beforeEach, describe, expect, it } from 'vitest'
import { useSimulation } from './useSimulation'

const initialState = useSimulation.getState()

describe('shared simulation state', () => {
  beforeEach(() => useSimulation.setState(initialState, true))

  it('locks remote LED control while disconnected but allows physical interaction', () => {
    useSimulation.getState().setWifiConnected(false)
    useSimulation.getState().toggleLed('red')
    expect(useSimulation.getState().leds.red).toBe(false)
    useSimulation.getState().toggleLed('red', 'physical')
    expect(useSimulation.getState().leds.red).toBe(true)
  })

  it('keeps relay state synchronized with its GPIO source', () => {
    useSimulation.getState().toggleRelay()
    expect(useSimulation.getState().relay).toBe(true)
    useSimulation.getState().setWifiConnected(false)
    useSimulation.getState().setRelay(false)
    expect(useSimulation.getState().relay).toBe(true)
    useSimulation.getState().setRelay(false, 'physical')
    expect(useSimulation.getState().relay).toBe(false)
  })

  it('runs the traffic sequence in red-yellow-green order', () => {
    useSimulation.getState().startTraffic()
    expect(useSimulation.getState().leds).toEqual({ red: true, yellow: false, green: false })
    useSimulation.getState().advanceTraffic()
    expect(useSimulation.getState().leds).toEqual({ red: false, yellow: true, green: false })
    useSimulation.getState().advanceTraffic()
    expect(useSimulation.getState().leds).toEqual({ red: false, yellow: false, green: true })
    useSimulation.getState().advanceTraffic()
    expect(useSimulation.getState().leds.red).toBe(true)
  })

  it('focuses the matching control tab when a circuit component is selected', () => {
    useSimulation.getState().setLabTab('network')
    useSimulation.getState().selectComponent('led-red')
    expect(useSimulation.getState().activeLabTab).toBe('led')
    useSimulation.getState().selectComponent('relay')
    expect(useSimulation.getState().activeLabTab).toBe('relay')
    useSimulation.getState().selectComponent('sht31')
    expect(useSimulation.getState().activeLabTab).toBe('dashboard')
    useSimulation.getState().selectComponent('esp32')
    expect(useSimulation.getState().activeLabTab).toBe('dashboard')
    useSimulation.getState().setLabTab('network')
    expect(useSimulation.getState().activeLabTab).toBe('network')
  })

  it('bounds sensor history and retains a connected sensor', () => {
    for (let index = 0; index < 50; index++) useSimulation.getState().tickSensor()
    const state = useSimulation.getState()
    expect(state.history).toHaveLength(40)
    expect(state.sensor.connected).toBe(true)
    expect(state.history[39].timestamp).toBe(state.sensor.timestamp)
  })
})
