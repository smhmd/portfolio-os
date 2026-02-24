import { useRef, useState } from 'react'

import clsx from 'clsx'

import { AppWrapper } from 'src/components'
import { WavyText } from 'src/components'
import { iconToFavicon } from 'src/utils'

import { Timer } from './components'
import { analyzeTyping, sentences } from './lib'
import { AppIcon, metadata } from './metadata'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: 'App to test your typing speed' },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon fill='transparent' padding={14} />)
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
      className={clsx(
        'flex flex-col items-center justify-center gap-6 p-4',
        'text-shadow-2xs text-shadow-current/20 font-mono',
        'bg-[whitesmoke] text-[#1A1A1A]',
      )}>
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
        <section className='contents'>
          <div
            className={clsx(
              'relative flex items-start',
              'aspect-square w-full max-w-sm',
              'p-2.5 sm:p-4',
              'cursor-text',
              'corner-[squircle_squircle_bevel_squircle] rounded-1.5xl rounded-br-5xl',
              'text-shadow-none bg-[#FFEB3B] text-[#1A1A1A]',
              'shadow-yellow-500/34 shadow',
              'rotate-2 transition-transform focus-within:rotate-0',
            )}>
            <span
              className={clsx(
                'corner-bevel rounded-br-full',
                'absolute bottom-0 right-0 size-12 bg-yellow-300',
              )}
            />
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
              className={clsx(
                'absolute inset-0 z-10',
                'select-none outline-none',
                'p-2.5 sm:p-4',
                'text-transparent caret-transparent empty:caret-black',
              )}
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
        </section>
      )}
    </AppWrapper>
  )
}
