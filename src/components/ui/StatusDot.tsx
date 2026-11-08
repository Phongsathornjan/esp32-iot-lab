export function StatusDot({ active = true, color = '#62e9ff' }: { active?: boolean; color?: string }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${active ? 'live-dot' : ''}`}
      style={{ backgroundColor: active ? color : '#536074', color: active ? color : '#536074' }}
    />
  )
}
