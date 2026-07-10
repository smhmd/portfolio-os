import { useSelector } from '@xstate/react'
import clsx from 'clsx'

import { actor } from '../lib'
import Endless from './Endless'
import Pattern from './Pattern'
import Tombola from './Tombola'

// The machine's top-level state names the screen; each screen is a self-contained
// component that draws its own overlay and (if it needs one) its own canvas.
const SCREENS = {
  TOMBOLA: Tombola,
  ENDLESS: Endless,
  PATTERN: Pattern,
} as const

export function Screen(props: React.ComponentProps<'div'>) {
  const Current = useSelector(
    actor,
    ({ value }) => SCREENS[value as keyof typeof SCREENS],
  )

  return (
    <div
      className={clsx(
        'col-span-10 row-span-6',
        'bg-screen-border text-white',
        'rounded p-px',
      )}
      {...props}>
      <div className='bg-screen rounded-ms relative size-full overflow-hidden'>
        <Current />
      </div>
    </div>
  )
}
