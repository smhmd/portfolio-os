import { useMemo } from 'react'

import clsx from 'clsx'
import { useAnimate } from 'motion/react'
import * as motion from 'motion/react-client'

import { useGlobals } from '~/contexts'
import { gpuTier, type Props } from '~/lib'
import { interpolate } from '~/utils'

import { useInstrument, useOptions } from '../lib'

type TineProps = Props<
  'button',
  {
    index: number
    num: number
    octave: number
    note: string
    padding: string
    height: number
  }
>

let isMouseDown = false

export function Tine({
  index,
  num,
  octave,
  note,
  className,
  padding,
  height,
  ...props
}: TineProps) {
  const { options } = useOptions()
  const { playNote } = useInstrument()

  const { width } = useGlobals()
  const tipHeight = useMemo(
    () => interpolate(width, [400, 1800], [8, 12]),
    [width],
  )

  const [outer, pluckAnimate] = useAnimate<HTMLSpanElement>()
  const [inner, flashAnimate] = useAnimate<HTMLSpanElement>()

  function pluck() {
    playNote({ index, note, octave })

    if (gpuTier < 1) return

    pluckAnimate(
      outer.current,
      { y: [-11, -10] },
      {
        type: 'spring',
        stiffness: 1000,
        damping: 1.2,
        mass: 0.2,
        velocity: -300,
      },
    )

    flashAnimate(
      inner.current,
      { opacity: [1, 0.2, 0] },
      {
        duration: 1.5,
        times: [0, 0.2, 1],
        ease: ['easeOut', 'easeOut'],
      },
    )
  }

  function handleClick() {
    pluck()
    isMouseDown = true
    document.addEventListener(
      'mouseup',
      () => {
        isMouseDown = false
      },
      { once: true },
    )
  }

  function handleEnter() {
    if (!isMouseDown) return
    pluck()
  }

  return (
    <button
      style={{
        height: `${height}%`,
        padding: `0 clamp(1px,${padding}vw,8px)`,
      }}
      className='group w-full cursor-pointer outline-none'
      onPointerDown={handleClick}
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
        ref={outer}
        className={clsx(
          '@container relative flex flex-col justify-end gap-y-2.5 overflow-hidden',
          'size-full rounded-b-full',
          'bg-gradient-to-b from-5%',
          'from-white/94 to-white/86',
          'font-quicksand tabular-nums',
          'shadow-[0_3px] shadow-black/25 sm:shadow-[0_4px]',
          'text-shadow-[0_1.5px] text-shadow-white/60',
        )}>
        <motion.span
          ref={inner}
          initial={{ opacity: 0 }}
          className='absolute inset-0 bg-gradient-to-b from-white from-40% to-transparent'
        />
        <span className='font-roboto -mb-2 whitespace-pre text-[clamp(.75rem,60cqw,2.75rem)] leading-[2vw]'>
          {'•\n'.repeat(octave - 4)}
        </span>
        <span className='whitespace-pre text-[clamp(.875rem,60cqw,3.5rem)] leading-[clamp(1rem,60cqw,4rem)]'>
          {options.labelType == 0 && num}
          {options.labelType == 1 && note}
          {options.labelType == 2 && `${num}\n${note}`}
        </span>
        <span
          style={{
            height: `${tipHeight}vh`,
          }}
          className={clsx(
            'w-full shrink-0 bg-gradient-to-b from-40%',
            'from-white/50 to-transparent',
          )}
        />
      </motion.span>
    </button>
  )
}
