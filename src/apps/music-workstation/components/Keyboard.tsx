import { useMemo, useRef } from 'react'

import { api, KEYS } from '../lib'
import { Button } from './Button'

export function Keyboard() {
  const isMouseDown = useRef(false)

  const handle = useMemo(
    () => ({
      click(note: string) {
        api.attackNote(note)
        isMouseDown.current = true
        document.addEventListener(
          'mouseup',
          () => {
            if (!isMouseDown.current) return
            api.releaseNote()
            isMouseDown.current = false
          },
          { once: true },
        )
      },
      enter(note: string) {
        if (!isMouseDown.current) return
        api.releaseNote()
        api.attackNote(note)
      },
      leave() {
        if (!isMouseDown.current) return
        api.releaseNote()
      },
    }),
    [],
  )

  return (
    <div className='contents' role='group'>
      {KEYS.map(({ note, variant }) => {
        const isBlack = variant !== 'vertical'
        return (
          <Button
            // text={isBlack ? undefined : `${note[0]}\n${note[1]}`}
            key={note}
            black={isBlack}
            variant={variant}
            onMouseDown={() => {
              handle.click(note)
            }}
            onMouseEnter={() => {
              handle.enter(note)
            }}
            onMouseLeave={() => {
              handle.leave()
            }}
          />
        )
      })}
    </div>
  )
}
