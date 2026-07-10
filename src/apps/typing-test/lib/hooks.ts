import { useRef, useState } from 'react'

import { sentences } from './common'
import { analyzeTyping } from './utils'

export function useTypingTest() {
  const [typed, setTyped] = useState('')
  const startTimeRef = useRef<number>(null)
  const endTimeRef = useRef<number>(null)

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const newInput = e.currentTarget.innerText
      .replace(/\u00A0/g, ' ')
      .replace(/\n/g, '')

    setTyped(newInput)

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    if (newInput.length >= sentences.length && !endTimeRef.current) {
      endTimeRef.current = Date.now()
    }
  }

  const handleReset = () => {
    startTimeRef.current = null
    endTimeRef.current = null
    setTyped('')
  }

  const { grade, wpm, accuracy, errors } =
    endTimeRef.current && startTimeRef.current
      ? analyzeTyping(
          sentences,
          typed,
          (endTimeRef.current - startTimeRef.current) / 1000,
        )
      : { accuracy: 0, wpm: 0, errors: 0 }

  return {
    typed,
    isIdle: !endTimeRef.current && !startTimeRef.current,
    isTyping: !!startTimeRef.current && !endTimeRef.current,
    isDone: !!endTimeRef.current,
    grade,
    wpm,
    accuracy,
    errors,
    handleInput,
    handleReset,
  }
}
