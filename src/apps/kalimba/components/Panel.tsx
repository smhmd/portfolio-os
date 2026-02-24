import clsx from 'clsx'
import type { HTMLMotionProps } from 'motion/react'
import * as motion from 'motion/react-client'

import { Record } from './Record'
import { Settings } from './Settings'

type PanelProps = HTMLMotionProps<'footer'>

export function Panel({ className, ...props }: PanelProps) {
  return (
    <motion.footer
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{
        delay: 0.2,
        ease: 'easeOut',
        stiffness: 200,
        damping: 25,
        bounce: 0,
      }}
      className={clsx(
        'flex w-full items-end justify-between',
        'xl:px-18 xl:pb-18 px-8 pb-16',
        className,
      )}
      {...props}>
      <Record />
      <Settings />
    </motion.footer>
  )
}
