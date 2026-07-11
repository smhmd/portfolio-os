import clsx from 'clsx'

import { store } from '../lib'
import ENDLESS from '../screens/endless/Endless'
import PATTERN from '../screens/pattern/Pattern'
import TOMBOLA from '../screens/tombola/Tombola'

// The store's `screen` field names the screen; each is a self-contained
// component that draws its own readouts and graphics.
const SCREENS = { TOMBOLA, ENDLESS, PATTERN }

export function Screen(props: React.ComponentProps<'div'>) {
  const screen = store.use(({ screen }) => screen)
  const recording = store.use(({ recording }) => recording)
  const Content = SCREENS[screen]

  return (
    <div
      className={clsx(
        'col-span-12 row-span-6',
        'bg-screen-border text-white',
        'rounded p-px',
      )}
      {...props}>
      {/* Every screen is a column: a fixed HUD band, then its content. */}
      <div className='bg-screen rounded-ms relative flex size-full flex-col overflow-hidden'>
        <Content />
        {recording ? (
          <span className='absolute bottom-2 right-2 z-20 size-2 animate-pulse rounded-full bg-red-500' />
        ) : null}
      </div>
    </div>
  )
}
