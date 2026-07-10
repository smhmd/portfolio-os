import { useEffect, useState } from 'react'

import { actor } from '../lib'

// Per WCAG spec, exactly 3 flashes in a second is permitted. We respect that.
const steps = [
  { text: '3', duration: 800 },
  { text: '2', duration: 800 },
  { text: '1', duration: 800 },
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
      // Never advance past the last step: rendering with
      // step === steps.length would throw. Previously this only worked
      // because the `game.start` unmount happened to batch with setStep.
      if (step === steps.length - 1) {
        actor.send({ type: 'game.start' })
      } else {
        setStep(step + 1)
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
