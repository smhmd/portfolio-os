import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'

import { type AppID, apps } from 'app/apps'
import { Battery, PlaceholderIcon, Wifi } from 'app/assets/svg'

import { StatusBarPanel } from './StatusBarPanel'

type Props = React.ComponentProps<'header'>

export function StatusBar({ className, ...props }: Props) {
  return (
    <header
      className={clsx('html-dark:invert fixed w-full', className)}
      {...props}>
      <Popover.Root>
        <Popover.Trigger className='w-full'>
          <div className='leading-0 sm:pl-5.5 flex justify-between px-2 sm:pr-4'>
            <div className='flex items-center justify-start gap-3 py-0.5'>
              <time
                className='font-roboto flex gap-3 p-0 text-sm tracking-wider text-white'
                dateTime='2024-11-27T09:10:00'>
                <span>17:39 </span>
                <span className='hidden sm:inline'>Thu, Jan 9</span>
              </time>
              <StatusNotifications
                value={['radio', '2048', 'gallery', 'files']}
              />
            </div>
            <StatusSystemIndicators />
          </div>
        </Popover.Trigger>
        <Popover.Content side='bottom' align='center'>
          <StatusBarPanel />
          <Popover.Arrow />
        </Popover.Content>
      </Popover.Root>
    </header>
  )
}

type NotificationsProps = {
  value: AppID[]
} & React.ComponentProps<'div'>

function StatusNotifications({ value, ...props }: NotificationsProps) {
  return (
    <div {...props}>
      <span
        id='notification-count'
        className='sr-only'
        aria-live='polite'
        aria-atomic='true'
        role='alert'>
        You have 3 notifications
      </span>

      <ul
        aria-labelledby='notification-count'
        className='flex h-full items-center justify-start gap-1.5'>
        {value.slice(0, 3).map((notification, i) => {
          const Icon = apps[notification].Icon
          return (
            <li key={i}>
              <Icon
                viewBox='15 15 70 70'
                className='size-4 fill-transparent grayscale'
              />
            </li>
          )
        })}

        {value.length > 3 ? (
          <li>
            <PlaceholderIcon
              fill='white'
              className='-ml-0.5 size-4'
              role='img'
              aria-label='More'
              id='more stuff'
            />
          </li>
        ) : null}
      </ul>
    </div>
  )
}

type StatusSystemIndicatorsProps = React.ComponentProps<'ul'>

function StatusSystemIndicators({
  className,
  ...props
}: StatusSystemIndicatorsProps) {
  return (
    <ul
      {...props}
      className={clsx('flex items-center justify-end gap-1.5', className)}>
      <li>
        <Wifi
          fill='white'
          className='size-4.5'
          role='img'
          aria-label='Wifi connected, 2 bars'
          id='wifi-icon'
        />
      </li>
      <li>
        <Battery
          fill='white'
          className='size-4.5'
          role='img'
          aria-label='Battery status, 85% charged'
          tabIndex={0}
          id='bluetooth-icon'
        />
      </li>
    </ul>
  )
}
