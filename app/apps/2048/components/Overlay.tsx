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
          'absolute -inset-2 flex items-center justify-center rounded-3xl text-6xl font-bold',
          className,
        )}
        {...props}>
        <p>{title}</p>
        <div className='absolute bottom-[20%] flex items-center text-base'>
          {children}
        </div>
      </motion.div>
    )
  },
)

Overlay.displayName = 'GameBoardOverlay'
