import { useState } from 'react'
import { CircuitBoard, Menu, X, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { scrollToSection } from '../lib/navigation'
import { useSimulation } from '../store/useSimulation'
import type { LabTab } from '../store/useSimulation'
import { StatusDot } from './ui/StatusDot'

type NavLink = { label: string; section: string } | { label: string; tab: LabTab }

const links: NavLink[] = [
  { label: 'Laboratory', section: 'laboratory' },
  { label: 'Dashboard', tab: 'dashboard' },
  { label: 'Network', tab: 'network' },
  { label: 'Learn', section: 'learn' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const connected = useSimulation((state) => state.wifiConnected)
  const setLabTab = useSimulation((state) => state.setLabTab)
  const setCircuitMode = useSimulation((state) => state.setCircuitMode)
  const navigate = (link: NavLink) => {
    if ('tab' in link) {
      setLabTab(link.tab)
      setCircuitMode('physical')
      scrollToSection('laboratory')
    } else {
      scrollToSection(link.section)
    }
    setOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#05070d]/80 backdrop-blur-xl">
      <div className="section-shell flex h-[72px] items-center justify-between">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3" aria-label="NEXUS home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan/25 bg-cyan/[0.06] text-cyan"><CircuitBoard size={20} /></span>
          <span className="text-left">
            <span className="block font-display text-[17px] font-bold tracking-[0.16em]">NEXUS</span>
            <span className="block font-mono text-[7px] tracking-[0.3em] text-slate-500">INTERACTIVE IoT LAB</span>
          </span>
        </button>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <button key={link.label} onClick={() => navigate(link)} className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400 transition hover:text-cyan">{link.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/[0.08] px-3 py-1.5 sm:flex">
            <StatusDot active={connected} color={connected ? '#57e39a' : '#536074'} />
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-slate-400">{connected ? 'Lab online' : 'Local mode'}</span>
          </div>
          <button onClick={() => navigate({ label: 'Laboratory', section: 'laboratory' })} className="btn-primary hidden !px-4 !py-2.5 md:inline-flex">Launch lab <ArrowUpRight size={14} /></button>
          <button className="icon-button lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/[0.06] bg-[#080c15] lg:hidden">
            <div className="section-shell grid gap-1 py-4">
              {links.map((link) => <button key={link.label} onClick={() => navigate(link)} className="rounded-lg px-3 py-3 text-left font-mono text-xs uppercase tracking-widest text-slate-300 hover:bg-white/5">{link.label}</button>)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
