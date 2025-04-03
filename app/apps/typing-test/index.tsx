import { useRef, useState } from 'react'

import { AppWrapper } from 'app/components'
import { WavyText } from 'app/components/WavyText'
import type { AppMetadata } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { Timer } from './components'
import { AppIcon } from './Icon'
import { analyzeTyping, sentences } from './lib'

export const metadata: AppMetadata = {
  id: 'typing-test',
  name: 'Typing Test',
  Icon: AppIcon,
}

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: 'App to test your typing speed' },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon />)
  return [favicon]
}

export default function App() {
  const [typed, setTyped] = useState('')
  const startTimeRef = useRef<number | null>(null) // Track the start time
  const endTimeRef = useRef<number | null>(null) // Track the end time

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    // Normalize spaces/remove new lines
    // because we're using contenteditable
    const newInput = e.currentTarget.innerText
      .replace(/\u00A0/g, ' ')
      .replace(/\n/g, '')

    setTyped(newInput)

    // Start the timer upon the first input
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    // If the user has typed the full sentence, stop the timer
    if (newInput.length >= sentences.length && !endTimeRef.current) {
      endTimeRef.current = Date.now()
    }
  }

  const handleReset = () => {
    startTimeRef.current = null
    endTimeRef.current = null
    setTyped('')
  }

  // Calculate time taken once the sentence is fully typed
  const { wpm, accuracy, errors } =
    endTimeRef.current && startTimeRef.current
      ? analyzeTyping(
          sentences,
          typed,
          (endTimeRef.current - startTimeRef.current) / 1000,
        )
      : { accuracy: 0, wpm: 0, errors: 0 }

  return (
    <AppWrapper
      isDark
      className='flex flex-col items-center justify-center gap-6 bg-[whitesmoke] p-4 font-mono text-black'>
      <h1 className='text-3xl font-black'>Typing Test</h1>
      {endTimeRef.current ? (
        <div className='flex flex-col items-center justify-center gap-y-4'>
          <div className='flex flex-col items-center justify-center'>
            <WavyText value={`WPM: ${Math.round(wpm)}`} />
            <WavyText value={`Accuracy: ${Math.round(accuracy)}%`} />
            <WavyText value={`Mistakes: ${errors}`} />
          </div>
          <button
            onClick={handleReset}
            className='cursor-pointer rounded bg-gray-900 px-4 py-2 text-xs text-white hover:bg-gray-800'>
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className='relative flex w-full max-w-3xl cursor-text items-start rounded bg-white p-2.5 sm:p-4'>
            <p className=''>
              {sentences.split('').map((char, index) => {
                let className = ''
                const letter = typed[index]
                if (typed.length > 0 && index < typed.length) {
                  className =
                    letter === char
                      ? 'text-green-600 bg-green-100'
                      : 'text-red-600 bg-red-100'
                }
                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                )
              })}
            </p>
            <p
              role='textbox'
              className='absolute inset-0 z-10 select-none p-2.5 text-transparent caret-black outline-none sm:p-4'
              contentEditable={!endTimeRef.current}
              autoFocus
              spellCheck={false}
              onInput={handleInput}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onKeyDown={(e) => {
                if (
                  // Prevent certain keys (like inserting new lines with enter)
                  ['Enter'].includes(e.key) ||
                  // Prevent Ctrl + A (Command + A on Mac)
                  ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a')
                  // Prevent Cmd + Backspace (Mac) or Ctrl + Backspace (Windows/Linux)
                  // ((e.ctrlKey || e.metaKey || e.altKey) && e.key === 'Backspace')
                ) {
                  e.preventDefault()
                }
              }}
            />
          </div>
          {startTimeRef.current ? (
            <Timer />
          ) : (
            <WavyText value='Start typing to begin!' />
          )}
        </>
      )}
    </AppWrapper>
  )
}
