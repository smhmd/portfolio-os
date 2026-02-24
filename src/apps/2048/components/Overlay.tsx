import { memo } from 'react'

import clsx from 'clsx'
import { type HTMLMotionProps, type Variants } from 'motion/react'
import * as motion from 'motion/react-client'

type OverlayProps = {
  title: string
  children: React.ReactNode
} & HTMLMotionProps<'div'>

const variants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
}

export const Overlay = memo(
  ({ title, className, children, ...props }: OverlayProps) => {
    return (
      <motion.div
        variants={variants}
        initial='initial'
        animate='animate'
        exit='exit'
        className={clsx(
          '@container absolute flex items-center justify-center text-6xl font-bold',
          'inset-0 z-10',
          className,
        )}
        {...props}>
        <p className='whitespace-nowrap text-[clamp(2rem,12cqw,4rem)]'>
          {title}
        </p>
        <div
          className={clsx(
            'absolute flex items-center',
            'bottom-[20%] text-base',
            '*:init:px-2 *:cursor-pointer',
          )}>
          {children}
        </div>
      </motion.div>
    )
  },
)

Overlay.displayName = 'GameBoardOverlay'
