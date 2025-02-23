import { useRef, useState } from 'react'

import { AppIcon, AppWrapper } from 'app/components'
import { WavyText } from 'app/components/WavyText'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

import { Timer } from './components'
import { analyzeTyping, sentences } from './lib'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: 'App to test your typing speed' },
  ]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
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
            <p className='select-none'>
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

export const metadata: AppMetadata = {
  id: 'typing-test',
  name: 'Typing Test',
  Icon: (props) => (
    <AppIcon fill='#292F33' {...props}>
      <path
        d='M86 66a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V34a4 4 0 0 1 4-4h64a4 4 0 0 1 4 4v32Z'
        fill='#fff'
      />
      <path
        d='M29.002 55.983a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm8 0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2Zm-43 8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2Zm40 0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2Zm-10 0a2 2 0 0 1-2 2h-24a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h24a2 2 0 0 1 2 2v2ZM24.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM32.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM40.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM48.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM56.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM64.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM72.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM80.416 49.397a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM24.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM32.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM40.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM48.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM56.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM64.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM72.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586ZM80.416 40.836a2 2 0 0 0 .586-1.414v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 1.414-.586Z'
        fill='#292F33'
      />
    </AppIcon>
  ),
}
