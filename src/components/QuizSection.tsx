import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Check, CheckCircle2, ChevronRight, RefreshCw, X, XCircle } from 'lucide-react'
import { quizQuestions } from '../data/education'
import { SectionHeading } from './ui/SectionHeading'
import { scrollToSection } from '../lib/navigation'

export function QuizSection() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [finished, setFinished] = useState(false)
  const question = quizQuestions[current]
  const selected = answers[question.id]
  const answered = selected !== undefined
  const score = quizQuestions.reduce((total, item) => total + (answers[item.id] === item.answer ? 1 : 0), 0)

  const answer = (index: number) => { if (!answered) setAnswers((items) => ({ ...items, [question.id]: index })) }
  const next = () => { if (current === quizQuestions.length - 1) setFinished(true); else setCurrent(current + 1) }
  const restart = () => { setAnswers({}); setCurrent(0); setFinished(false) }

  return (
    <section id="quiz" className="relative py-24 sm:py-28">
      <div className="section-shell">
        <SectionHeading number="06" eyebrow="Knowledge check" title="Ready to validate your understanding?" description="Six practical questions about the exact circuit you just explored. Get instant feedback and a clear explanation for every answer." />
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b101c] shadow-[0_30px_100px_rgba(0,0,0,.3)]">
          {!finished ? <>
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-cyan">QUESTION {String(current + 1).padStart(2, '0')}</span><span className="h-3 w-px bg-white/10" /><span className="font-mono text-[9px] text-slate-600">OF {String(quizQuestions.length).padStart(2, '0')}</span></div><span className="chip">Score {score}/{quizQuestions.length}</span></div>
            <div className="h-0.5 bg-white/[0.05]"><motion.div animate={{ width: `${((current + 1) / quizQuestions.length) * 100}%` }} className="h-full bg-cyan" /></div>
            <AnimatePresence mode="wait"><motion.div key={question.id} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="p-5 sm:p-8 lg:p-10">
              <h3 className="max-w-3xl font-display text-xl font-semibold leading-8 sm:text-2xl">{question.question}</h3>
              <div className="mt-7 grid gap-3">{question.options.map((option, index) => {
                const isCorrect = answered && index === question.answer; const isWrong = answered && selected === index && index !== question.answer
                return <button key={option} disabled={answered} onClick={() => answer(index)} className={`flex items-center gap-4 rounded-xl border p-4 text-left transition ${isCorrect ? 'border-emerald-400/35 bg-emerald-400/[0.055]' : isWrong ? 'border-red-400/35 bg-red-400/[0.05]' : answered ? 'border-white/[0.06] opacity-50' : 'border-white/[0.09] bg-white/[0.02] hover:border-cyan/30 hover:bg-cyan/[0.035]'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-[10px] ${isCorrect ? 'border-emerald-400/30 text-emerald-300' : isWrong ? 'border-red-400/30 text-red-300' : 'border-white/10 text-slate-500'}`}>{isCorrect ? <Check size={15} /> : isWrong ? <X size={15} /> : String.fromCharCode(65 + index)}</span><span className={`flex-1 text-sm ${isCorrect ? 'text-emerald-100' : isWrong ? 'text-red-100' : 'text-slate-300'}`}>{option}</span>{isCorrect && <span className="hidden font-mono text-[8px] uppercase tracking-widest text-emerald-300 sm:block">Correct answer</span>}</button>
              })}</div>
              <AnimatePresence>{answered && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`mt-5 rounded-xl border p-4 ${selected === question.answer ? 'border-emerald-400/15 bg-emerald-400/[0.03]' : 'border-amber-300/15 bg-amber-300/[0.03]'}`}><div className="flex gap-3">{selected === question.answer ? <CheckCircle2 size={18} className="shrink-0 text-emerald-300" /> : <XCircle size={18} className="shrink-0 text-amber-300" />}<div><p className={`text-xs font-medium ${selected === question.answer ? 'text-emerald-200' : 'text-amber-200'}`}>{selected === question.answer ? 'Correct — well done.' : 'Not quite. Here is the key idea:'}</p><p className="mt-2 text-xs leading-6 text-slate-400">{question.explanation}</p></div></div></motion.div>}</AnimatePresence>
              <div className="mt-7 flex items-center justify-between"><div className="flex gap-1.5">{quizQuestions.map((item, index) => <button key={item.id} aria-label={`Go to question ${index + 1}`} onClick={() => setCurrent(index)} className={`h-1.5 rounded-full transition-all ${index === current ? 'w-6 bg-cyan' : answers[item.id] !== undefined ? 'w-1.5 bg-emerald-400' : 'w-1.5 bg-slate-700'}`} />)}</div><button disabled={!answered} onClick={next} className="btn-primary">{current === quizQuestions.length - 1 ? 'View final score' : 'Next question'}<ChevronRight size={14} /></button></div>
            </motion.div></AnimatePresence>
          </> : <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-7 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan/25 bg-cyan/[0.06] text-cyan shadow-glow"><Award size={38} /></div><p className="eyebrow mt-6">Assessment complete</p><h3 className="mt-3 font-display text-3xl font-semibold">{score === quizQuestions.length ? 'Perfect circuit knowledge.' : score >= 4 ? 'Strong engineering instincts.' : 'Good start—keep exploring.'}</h3><div className="mt-6 flex items-baseline justify-center gap-2"><span className="font-display text-6xl font-semibold text-cyan">{Math.round((score / quizQuestions.length) * 100)}%</span><span className="font-mono text-xs text-slate-500">{score} / {quizQuestions.length} CORRECT</span></div><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-400">{score === quizQuestions.length ? 'You understand the GPIO map, I²C sensor, relay control, and local Wi-Fi communication.' : 'Review the live lessons and try again. Every answer includes an explanation to help close the gap.'}</p><div className="mx-auto mt-7 grid max-w-lg grid-cols-3 gap-2">{quizQuestions.map((item) => <div key={item.id} className={`rounded-lg border p-3 ${answers[item.id] === item.answer ? 'border-emerald-400/15 bg-emerald-400/[0.03]' : 'border-red-400/15 bg-red-400/[0.03]'}`}><p className="font-mono text-[8px] text-slate-600">Q{item.id}</p><p className={`mt-1 font-mono text-[10px] ${answers[item.id] === item.answer ? 'text-emerald-300' : 'text-red-300'}`}>{answers[item.id] === item.answer ? 'CORRECT' : 'REVIEW'}</p></div>)}</div><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={restart} className="btn-primary"><RefreshCw size={14} />Retake quiz</button><button onClick={() => scrollToSection('learn')} className="btn-secondary">Review lessons</button></div>
          </motion.div>}
        </div>
      </div>
    </section>
  )
}
