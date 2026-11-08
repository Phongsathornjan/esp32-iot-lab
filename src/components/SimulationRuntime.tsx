import { useEffect } from 'react'
import { useSimulation } from '../store/useSimulation'

export function SimulationRuntime() {
  const trafficActive = useSimulation((state) => state.traffic.active)
  const trafficStage = useSimulation((state) => state.traffic.stage)
  const duration = useSimulation((state) => state.traffic.durations[trafficStage])

  useEffect(() => {
    const timer = window.setInterval(() => useSimulation.getState().tickSensor(), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!trafficActive) return
    const timer = window.setTimeout(() => useSimulation.getState().advanceTraffic(), duration * 1000)
    return () => window.clearTimeout(timer)
  }, [trafficActive, trafficStage, duration])

  return null
}
