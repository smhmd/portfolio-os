import { useEffect, useState } from 'react'

import { useSelector } from '@xstate/react'
import clsx from 'clsx'

import { audioContext } from 'src/lib/audio'

import { actor, endless, settings } from '../lib'

const BLUE = '#6f87ff'
const BROWN = '#ab8567'
const ORANGE = '#d54922'
const DOT_ON = '#c9c5c2'
const DOT_OFF = '#3a3734'

/** Endless is all HTML — no canvas. */
export default function Endless() {
  const context = useSelector(actor, ({ context }) => context)
  const { division, swing, pattern, mode } = settings(context)
  const { sequence, playing } = context
  const [head, setHead] = useState(-1)

  // Mounted exactly while on-screen, so it owns the transport. A lightweight rAF
  // (only while playing) follows the sounding note; setState bails on an
  // unchanged index, so it re-renders on note boundaries, not every frame.
  useEffect(() => {
    if (!playing) return
    endless.start()
    let raf = requestAnimationFrame(function tick() {
      setHead(endless.playhead(audioContext.currentTime))
      raf = requestAnimationFrame(tick)
    })
    return () => {
      endless.stop()
      cancelAnimationFrame(raf)
    }
  }, [playing])

  return (
    <div className='pointer-events-none absolute inset-0 z-10 flex flex-col p-2 text-xs lowercase'>
      <div className='flex items-center justify-between px-2 py-1'>
        <div style={{ color: BLUE }}>1/{division}</div>

        <div style={{ color: BROWN }}>{Math.round(swing * 100)}%</div>

        {/* Gate mask — dots wrap every 4 */}
        <div className='grid w-fit grid-cols-4 gap-1'>
          {[...pattern].map((bit, index) => (
            <div
              key={index}
              className='size-1.5 rounded-full'
              style={{ background: bit === '1' ? DOT_ON : DOT_OFF }}
            />
          ))}
        </div>

        <div
          className={clsx('normal-case', mode === 'backward' && '-scale-x-100')}
          style={{ color: ORANGE }}>
          {mode === 'forward' ? '←' : mode === 'backward' ? 'R' : 'S'}
        </div>
      </div>

      {/* While playing: the live position; while building: how many stored */}
      <div className='grid flex-1 place-items-center text-5xl text-white'>
        {playing && head >= 0 ? head + 1 : sequence.length}
      </div>

      <div className='flex justify-center gap-4 pb-1 text-[10px] tracking-wide opacity-50'>
        <span>⌫ delete</span>
        <span>{'>'} pause</span>
        <span>▶ play</span>
      </div>
    </div>
  )
}
