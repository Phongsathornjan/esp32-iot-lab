import { ArrowUp, CircuitBoard, Radio } from 'lucide-react'
import { scrollToSection } from '../lib/navigation'

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-[#04060b]">
      <div className="section-shell py-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan/20 bg-cyan/[0.05] text-cyan"><CircuitBoard size={20} /></span><div><p className="font-display text-sm font-bold tracking-[0.16em]">NEXUS IoT LAB</p><p className="mt-1 font-mono text-[8px] uppercase tracking-widest text-slate-600">Learn by connecting.</p></div></div>
          <nav className="flex flex-wrap gap-x-6 gap-y-3">{[['Laboratory', 'laboratory'], ['Wiring', 'connections'], ['Data flow', 'data-flow'], ['Lessons', 'learn'], ['Quiz', 'quiz']].map(([label, id]) => <button key={id} onClick={() => scrollToSection(id)} className="font-mono text-[9px] uppercase tracking-wider text-slate-500 transition hover:text-cyan">{label}</button>)}</nav>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="icon-button" aria-label="Back to top"><ArrowUp size={15} /></button>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.05] pt-6 sm:flex-row sm:items-center sm:justify-between"><p className="font-mono text-[8px] uppercase tracking-wider text-slate-700">Frontend-only educational simulation · No hardware or backend required</p><p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-wider text-slate-600"><Radio size={11} className="text-emerald-400" />All systems simulated locally</p></div>
      </div>
    </footer>
  )
}
