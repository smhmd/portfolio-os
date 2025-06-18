import { useEffect, useState } from 'react'

import { actor } from '../lib'

const steps = [
  { text: '1', duration: 800 },
  { text: '2', duration: 800 },
  { text: '3', duration: 800 },
  { text: 'Let It Rip!!', duration: 50 },
  { text: '', duration: 50 },
  { text: 'Let It Rip!!', duration: 50 },
  { text: '', duration: 50 },
  { text: 'Let It Rip!!', duration: 50 },
  { text: '', duration: 200 },
]

export function Countdown() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((prev) => prev + 1)

      if (step === steps.length - 1) {
        actor.send({ type: 'game.start' })
      }
    }, steps[step].duration)

    return () => clearTimeout(timer)
  }, [step])

  return (
    <section
      className='absolute inset-x-0 top-[18vh] flex items-center justify-center text-5xl font-light'
      role='timer'
      aria-live='polite'
      aria-label='Game countdown'>
      <div
        key={step}
        className='scale-110 transform animate-pulse text-amber-300 transition-all duration-300 ease-in-out'>
        {steps[step].text}
      </div>
    </section>
  )
}
