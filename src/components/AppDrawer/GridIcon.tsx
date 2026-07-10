import clsx from 'clsx'
import type { Transition, Variants } from 'motion/react'
import * as motion from 'motion/react-client'

import type { Props } from 'src/lib/types'

const spring: Transition = {
  type: 'spring',
  damping: 24,
  stiffness: 300,
}

type GridIconProps = Props<
  typeof motion.li,
  {
    name: string
    disableAnimation?: boolean
    className?: string
    children: React.ReactNode
  }
>

const variants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
  hover: { scale: 1.05 },
}

export function GridIcon({
  name,
  className,
  children,
  ...props
}: GridIconProps) {
  return (
    <motion.li
      className={clsx(
        'group/icon',
        'pointer-events-auto',
        'relative flex cursor-pointer flex-col items-center justify-center gap-2',
        className,
      )}
      layout
      transition={spring}
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      whileHover='hover'
      {...props}>
      {children}
      <span className='text-shadow-xs line-clamp-2 h-[2lh] text-pretty text-center text-xs font-medium text-white sm:text-sm'>
        {name}
      </span>
    </motion.li>
  )
}

export const iconClassName =
  'size-18 transition-transform group-active:scale-90 sm:size-28'
