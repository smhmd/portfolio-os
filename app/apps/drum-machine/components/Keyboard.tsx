import { useRef } from 'react'

import { initToneOnClick } from 'app/lib'

import { Button } from './Button'

type KeyboardProps = {
  onAttackNote: (note: string) => void
  onReleaseNote: () => void
}

export function Keyboard({ onAttackNote, onReleaseNote }: KeyboardProps) {
  const isMouseDown = useRef(false)

  function handleMouseClick(note: string) {
    onAttackNote(note)
    isMouseDown.current = true
    const controller = new AbortController()
    document.addEventListener(
      'mouseup',
      () => {
        if (isMouseDown.current) {
          onReleaseNote()
          isMouseDown.current = false
          controller.abort()
        }
      },
      { signal: controller.signal },
    )
  }

  function handleMouseEnter(note: string) {
    if (isMouseDown.current) {
      onReleaseNote()
      onAttackNote(note)
    }
  }

  function handleMouseLeave() {
    if (isMouseDown.current) {
      onReleaseNote()
    }
  }

  return (
    <div className='contents' role='group'>
      {keys.map(({ note, variant }) => (
        <Button
          key={note}
          black={variant !== 'large'}
          variant={variant}
          onMouseDown={async () => {
            await initToneOnClick()
            handleMouseClick(note)
          }}
          onMouseEnter={() => {
            handleMouseEnter(note)
          }}
          onMouseLeave={() => {
            handleMouseLeave()
          }}
        />
      ))}
    </div>
  )
}

const keys = [
  { note: 'F#3', variant: 'right' },
  { note: 'G#3', variant: 'DEFAULT' },
  { note: 'A#3', variant: 'left' },
  { note: 'C#4', variant: 'right' },
  { note: 'D#4', variant: 'left' },
  { note: 'F#4', variant: 'right' },
  { note: 'G#4', variant: 'DEFAULT' },
  { note: 'A#4', variant: 'left' },
  { note: 'C#5', variant: 'right' },
  { note: 'D#5', variant: 'left' },
  { note: 'F3', variant: 'large' },
  { note: 'G3', variant: 'large' },
  { note: 'A3', variant: 'large' },
  { note: 'B3', variant: 'large' },
  { note: 'C4', variant: 'large' },
  { note: 'D4', variant: 'large' },
  { note: 'E4', variant: 'large' },
  { note: 'F4', variant: 'large' },
  { note: 'G4', variant: 'large' },
  { note: 'A4', variant: 'large' },
  { note: 'B4', variant: 'large' },
  { note: 'C5', variant: 'large' },
  { note: 'D5', variant: 'large' },
  { note: 'E5', variant: 'large' },
] as const
