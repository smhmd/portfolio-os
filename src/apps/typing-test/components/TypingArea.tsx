import clsx from 'clsx'

import { FONT, sentences } from '../lib'

type SentenceDisplayProps = { typed: string }
type TypingInputProps = { isDone: boolean; onInput(e: React.FormEvent): void }
type GradeProps = { grade: number | undefined }
type TypingAreaProps = TypingInputProps & SentenceDisplayProps & GradeProps

export function TypingArea({ isDone, typed, onInput, grade }: TypingAreaProps) {
  return (
    <div
      className={clsx(
        'size-full cursor-text px-2.5 pt-6 text-[#465862] sm:px-4',
        'font-bold leading-9',
        'font-(--font)',
      )}
      style={
        {
          '--font': FONT,
          backgroundImage: `repeating-linear-gradient( transparent 0 calc(2.25rem - 1px), #46586245 calc(2.25rem - 1px) 2.25rem)`,
          backgroundPosition: `0 calc(1rem + 1px)`,
        } as React.CSSProperties
      }>
      <div className='relative size-full'>
        <SentenceDisplay typed={typed} />
        <TypingInput isDone={isDone} onInput={onInput} />
        <Grade grade={grade} />
      </div>
    </div>
  )
}

function SentenceDisplay({ typed }: SentenceDisplayProps) {
  return (
    <p>
      {sentences.split('').map((char, index) => {
        const letter = typed[index]
        const isLast = typed.length - 1 === index

        const isTyped = index < typed.length
        const isCorrect = letter === char
        // const isSpace = char === ' '

        return (
          <span
            key={index}
            className={clsx({
              'init:bg-green-100 init:text-green-600': isCorrect,
              'bg-red-100 text-red-600': isTyped && !isCorrect,
              'border-r border-black': isLast && isTyped,
              // 'bg-green-100/65': isCorrect && isSpace,
            })}>
            {char}
          </span>
        )
      })}
    </p>
  )
}

function TypingInput({ isDone, onInput }: TypingInputProps) {
  function disableEvent(e: React.SyntheticEvent<HTMLParagraphElement>) {
    e.preventDefault()
  }

  function inputHandler(e: React.KeyboardEvent) {
    const isEnter = e.key === 'Enter'
    const isSelectingAll =
      (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a'
    if (isEnter || isSelectingAll) e.preventDefault()
  }

  return (
    <p
      role='textbox'
      className={clsx(
        'absolute inset-0 z-10',
        'select-none outline-none',
        'text-transparent caret-transparent empty:caret-black',
      )}
      contentEditable={!isDone}
      autoFocus
      spellCheck={false}
      onInput={onInput}
      onCopy={disableEvent}
      onCut={disableEvent}
      onPaste={disableEvent}
      onKeyDown={inputHandler}
    />
  )
}

const grades = [
  {
    path: 'M490 752q2 21-10 31-10 11-25 12-14 2-26-6-12-9-16-26l-20-190q-9-5-15-12-7-6-8-16-2-18 17-31l-2-24-3-30q-2-22-7-43-4-21-15-33-4-8-6-17-2-23 24-35 32-9 64-14l114-15q27-3 54-10 23-2 35 6a29 29 0 0 1 13 22q2 12-6 23-7 10-25 17-28 7-57 10l-59 8-32 4q-14 1-32 5 6 15 8 31l6 58 3 26q39-4 80-11 36-5 70-19 23-3 35 6a29 29 0 0 1 15 22 31 31 0 0 1-12 29q-17 12-36 19-25 8-51 11-29 5-55 7l-39 4z',
    color: 'text-red-500',
  },
  {
    path: 'M434 788q-28-2-38-17l-3-4q-7-11-7-18l-36-337-6 3-10 1q-17 2-29-6t-13-21q-1-18 17-32 21-16 47-27a367 367 0 0 1 212-20q44 13 81 42 34 29 54 69a243 243 0 0 1-27 263q-21 24-50 41-29 18-60 29-33 11-66 19l-65 14zm35-417-22 4-22 5 35 332 88-25q19-8 39-19 17-12 29-28 22-28 30-63 9-34 5-70-3-29-16-57-14-27-37-46-24-19-56-28t-73-5',
    color: 'text-orange-500',
  },

  {
    path: 'M627 634q12-12 29-14 15-2 27 6a31 31 0 0 1 13 23l-2 18-26 43q-14 20-32 38-19 17-42 28-24 12-52 14a181 181 0 0 1-146-49q-30-28-47-66a260 260 0 0 1-21-145q6-35 20-68 12-30 32-54 21-24 46-43 29-21 61-38h-1q21-12 42-20 20-8 39-10 29-3 55 11 25 14 49 51l3 12a31 31 0 0 1-8 26q-10 11-24 12-18 2-36-12l-20-25q-6-8-15-6l-13 4-20 9-12 6q-27 15-51 33-24 20-42 44a181 181 0 0 0-30 127q3 27 14 52 10 25 27 45 18 18 41 29 24 10 51 7 16-2 30-10 14-9 24-21a186 186 0 0 0 36-56z',
    color: 'text-violet-500',
  },
  {
    path: 'M436 794q-21 0-31-9-9-8-12-21l3-15-1 1-34-326h-7q-17 2-28-6a28 28 0 0 1-13-21q-2-17 16-35 19-18 43-31a351 351 0 0 1 103-36 177 177 0 0 1 120 30q23 15 36 38 13 20 16 42 3 27-10 57-13 29-36 52 40 16 61 44a113 113 0 0 1 21 102q-6 23-18 42a173 173 0 0 1-69 61q-28 12-57 18l-60 9-21 3zm9-294 42-2q13-3 25-9 15-6 29-17 13-9 22-23t7-30q-1-16-11-27-9-11-22-17t-28-9-30-1q-24 3-47 13zm135 83q-19-9-39-13-21-4-42-4l-46 9 15 147 43-6q26-5 48-15 23-11 39-27 15-18 12-44-1-15-9-28t-21-19',
    color: 'text-sky-500',
  },
  {
    path: 'M706 689q0 20-9 31-10 11-24 12a42 42 0 0 1-41-21 544 544 0 0 0-47-134l-197 22h-1l-20 131q-4 18-13 26a35 35 0 0 1-37 9l-14-8q-14-12-11-34 13-112 38-223 26-113 68-219l-1 1q5-16 25-24a36 36 0 0 1 38 4q22 17 40 38a583 583 0 0 1 68 91l47 76 19 35 37-5q17 5 25 12a30 30 0 0 1 4 41q-7 11-25 17l-9 1q25 59 40 121M496 416l-45-61a1310 1310 0 0 0-49 173l151-18-23-40-25-41z',
    color: 'text-green-500',
  },
]

function Grade({ grade }: GradeProps) {
  if (typeof grade === 'undefined') return null

  const { path, color } = grades[grade]
  return (
    <svg
      className={clsx('absolute bottom-2 left-0 size-16', color)}
      fill='none'
      viewBox='0 0 1000 1000'>
      <path fill='currentColor' d={path} />
      <path
        fill='currentColor'
        d='M210 211C36 380-26 687 154 876c164 172 463 155 638 11a513 513 0 0 0 58-738A500 500 0 0 0 568 9C385-20 180 21 68 180q-27 38-45 82c-16 38 29 70 48 27C144 116 329 61 500 73c84 5 167 27 239 72a400 400 0 0 1 185 292 485 485 0 0 1-11 173l-1 4a334 334 0 0 1-27 65q-24 48-59 90a461 461 0 0 1-554 112 329 329 0 0 1-169-244 424 424 0 0 1 137-370c24-24 2-87-30-56'></path>
    </svg>
  )
}
