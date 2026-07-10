import { useEffect, useMemo, useRef } from 'react'

import clsx from 'clsx'
import { animate } from 'motion/react'
import * as motion from 'motion/react-client'

import { useGlobals } from 'src/contexts'
import { interpolate } from 'src/lib/math'
import type { Props } from 'src/lib/types'
import { gpuTier } from 'src/lib/utils'

import {
  colors,
  getTineOrder,
  keyboardKeys,
  type TineInfo,
  useInstrument,
  useOptions,
} from '../lib'

type TineProps = Props<
  'button',
  {
    index: number
    height: number
    padding: string
  } & TineInfo
>

/**
 * To allow playing other notes while pressing mouse down without releasing.
 * Shared. No point in making it a React ref.
 */
let isPointerDown = false

export function Tine({
  index,
  num,
  pips,
  octave,
  note,
  padding,
  height,
  ...props
}: TineProps) {
  const { options } = useOptions()
  const { playNote } = useInstrument()

  const { width, isAppDrawerOpen, isReducedMotion } = useGlobals()
  const tipHeight = useMemo(
    () => interpolate(width, [400, 1800], [8, 12]),
    [width],
  )

  const outerRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)

  function pluckAndPlay() {
    if (isAppDrawerOpen.current) return
    if (!outerRef.current) return
    if (!innerRef.current) return

    playNote({ index, note, octave })

    if (isReducedMotion.current) return

    animate(
      outerRef.current,
      { y: [-11, -10] },
      {
        type: 'spring',
        stiffness: 1000,
        damping: 1.2,
        mass: 0.2,
        velocity: -300,
      },
    )

    const flash = animate(
      innerRef.current,
      { opacity: [1, 0.2, 0] },
      {
        duration: 1.5,
        times: [0, 0.2, 1],
        ease: ['easeOut', 'easeOut'],
      },
    )

    if (gpuTier < 1) flash.cancel()
  }

  function clear() {
    isPointerDown = false
  }

  function handlePointerDown() {
    pluckAndPlay()
    isPointerDown = true
    document.addEventListener('pointerup', clear, { once: true })
    document.addEventListener('pointercancel', clear, { once: true })
  }

  function handleEnter() {
    if (!isPointerDown) return
    pluckAndPlay()
  }

  useEffect(() => {
    const code = keyboardKeys[index]
    const controller = new AbortController()

    document.addEventListener(
      'keypress',
      (e) => {
        // if the user is entering a shortcut (i.e. ctrl+r to reload)
        // don't fire
        const modified = [
          e.repeat,
          e.metaKey,
          e.ctrlKey,
          e.shiftKey,
          e.altKey,
        ].some(Boolean)
        return !modified && e.code == code && pluckAndPlay()
      },
      { signal: controller.signal },
    )

    return () => controller.abort()
  }, [])

  return (
    <button
      aria-label={`Play ${note}${octave}`}
      style={{
        height: `${height}%`,
        padding: `0 clamp(1px,${padding}vw,8px)`,
        order: getTineOrder(index),
      }}
      className='@container group w-full cursor-pointer outline-none'
      onPointerDown={handlePointerDown}
      onPointerEnter={handleEnter}
      {...props}>
      <motion.span
        initial={{ y: '-110%' }}
        animate={{ y: -10 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 25,
          bounce: 0,
        }}
        ref={outerRef}
        className={clsx(
          'relative flex size-full flex-col justify-end overflow-hidden rounded-b-full',
          'corner-1.5 gap-y-2.5',
          'bg-linear-to-b from-white from-5%',
          colors[options.color].bg,
          colors[options.color].text,
          'whitespace-pre tabular-nums',
          'text-[clamp(.875rem,60cqw,3.5rem)] leading-[clamp(1rem,50cqw,4rem)]',
          'text-shadow-[0_1.5px] text-shadow-white/60',
          'shadow-[0_3px] shadow-black/25 sm:shadow-[0_4px]',
        )}>
        <motion.span
          ref={innerRef}
          initial={{ opacity: 0 }}
          className='bg-linear-to-b absolute inset-0 from-white from-60% to-transparent'
        />
        <span className='font-roboto -mb-2 text-[clamp(.75rem,60cqw,2.75rem)] leading-[2vw]'>
          {'•\n'.repeat(pips)}
        </span>
        {options.labelType != 1 && <span>{num}</span>}
        {options.labelType != 0 && (
          <span className='-tracking-wide'>
            <span>{note[0]}</span>
            <span className='leading-0 text-[clamp(.3rem,30cqw,2rem)]'>
              {note[1]}
            </span>
          </span>
        )}
        <span
          style={{ height: `${tipHeight}vh` }}
          className={clsx(
            'bg-linear-to-b w-full shrink-0 from-40%',
            'from-white/50 to-transparent',
          )}
        />
      </motion.span>
    </button>
  )
}
