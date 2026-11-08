import { motion } from 'framer-motion'
import { CircuitBoard } from 'lucide-react'

export function LoadingScreen() {
  return (
    <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05070d]">
      <div className="flex w-64 flex-col items-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan/25 bg-cyan/[0.04] text-cyan shadow-glow">
          <CircuitBoard size={30} />
        </motion.div>
        <p className="font-display text-lg font-semibold tracking-[0.2em]">NEXUS</p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500">Initializing virtual laboratory</p>
        <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
          <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.1, ease: 'easeInOut' }} className="h-full w-full bg-cyan shadow-[0_0_10px_#62e9ff]" />
        </div>
        <div className="mt-3 flex w-full justify-between font-mono text-[8px] uppercase tracking-widest text-slate-600"><span>ESP32 DevKit V1</span><span>Ready</span></div>
      </div>
    </motion.div>
  )
}
