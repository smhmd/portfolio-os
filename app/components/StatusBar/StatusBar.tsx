import { useLocation } from 'react-router'

import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'

import { StatusBarPanel } from './StatusBarPanel'
import { StatusBarTop } from './StatusBarTop'

export function StatusBar() {
  const location = useLocation()
  const isHome = location.pathname !== '/'

  return (
    <Popover.Root>
      <header
        className={clsx('fixed top-0 z-50 w-full', isHome && 'bg-black/40')}>
        <Popover.Trigger className='w-full'>
          <StatusBarTop />
        </Popover.Trigger>
        <Popover.Content side='bottom' align='center'>
          <StatusBarPanel />
          <Popover.Arrow />
        </Popover.Content>
      </header>
    </Popover.Root>
  )
}
