interface ToggleProps {
  checked: boolean
  onChange: () => void
  label: string
  disabled?: boolean
  color?: string
  small?: boolean
}

export function Toggle({ checked, onChange, label, disabled = false, color = '#62e9ff', small = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`${small ? 'h-5 w-9' : 'h-6 w-11'} relative shrink-0 rounded-full border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40`}
      style={{
        backgroundColor: checked ? `${color}25` : '#171e2b',
        borderColor: checked ? `${color}70` : '#30394a',
      }}
    >
      <span
        className={`${small ? 'h-3 w-3' : 'h-4 w-4'} absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300`}
        style={{
          left: checked ? (small ? '19px' : '24px') : '3px',
          backgroundColor: checked ? color : '#697386',
          boxShadow: checked ? `0 0 12px ${color}80` : 'none',
        }}
      />
    </button>
  )
}
