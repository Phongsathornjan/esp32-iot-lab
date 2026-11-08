import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { CircuitLab } from './components/CircuitLab'
import { ConnectionSection } from './components/ConnectionSection'
import { DataFlowSection } from './components/DataFlowSection'
import { LearningSection } from './components/LearningSection'
import { QuizSection } from './components/QuizSection'
import { Footer } from './components/Footer'
import { LoadingScreen } from './components/LoadingScreen'
import { SimulationRuntime } from './components/SimulationRuntime'

export default function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1250)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <>
      <SimulationRuntime />
      <AnimatePresence>{loading && <LoadingScreen />}</AnimatePresence>
      <Navbar />
      <main>
        <Hero />
        <div className="section-line" />
        <CircuitLab />
        <div className="section-line" />
        <ConnectionSection />
        <div className="section-line" />
        <DataFlowSection />
        <div className="section-line" />
        <LearningSection />
        <div className="section-line" />
        <QuizSection />
      </main>
      <Footer />
    </>
  )
}
