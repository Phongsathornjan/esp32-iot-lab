import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  number: string
  eyebrow: string
  title: string
  description: string
  action?: ReactNode
}

export function SectionHeading({ number, eyebrow, title, description, action }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55 }}
      className="mb-8 flex flex-col justify-between gap-6 md:mb-10 md:flex-row md:items-end"
    >
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="font-mono text-[10px] text-slate-600">/{number}</span>
          <span className="h-px w-8 bg-cyan/50" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl lg:text-[44px]">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-[15px]">{description}</p>
      </div>
      {action}
    </motion.div>
  )
}
