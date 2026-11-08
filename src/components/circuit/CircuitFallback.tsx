import { CircuitBoard, MousePointer2 } from 'lucide-react'

export function CircuitFallback({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center justify-center bg-[#080d16] ${compact ? 'h-full min-h-[360px]' : 'min-h-[540px]'}`}>
      <div className="max-w-md p-8 text-center">
        <CircuitBoard className="mx-auto mb-5 text-cyan" size={44} strokeWidth={1.2} />
        <h3 className="font-display text-xl font-semibold">Interactive circuit available in 2D</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">WebGL is unavailable in this browser. Use the Connection Diagram and GPIO Mapping views for the complete circuit, or enable hardware acceleration to explore it in 3D.</p>
        <p className="mt-5 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-widest text-slate-500"><MousePointer2 size={13} />All dashboard controls remain operational</p>
      </div>
    </div>
  )
}
