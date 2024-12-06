import { type AppID, apps } from 'app/apps'
import { Battery, PlaceholderIcon, Wifi } from 'app/assets/svg'

export function StatusBarTop() {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-atomic='true'
      aria-relevant='additions'
      className='grid h-full w-full grid-cols-3 px-7 pt-0.5'>
      <StatusNotifications value={['2048', 'camera', 'gallery', 'files']} />
      <StatusClock />
      <StatusSystemIndicators />
    </div>
  )
}

type NotificationsProps = {
  value: AppID[]
}

function StatusNotifications({ value }: NotificationsProps) {
  return (
    <div className='place-items-start'>
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
              <Icon className='size-4.5 fill-black/10 grayscale' />
            </li>
          )
        })}

        {value.length > 3 ? (
          <li>
            <PlaceholderIcon
              className='size-4.5 -ml-0.5'
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

function StatusClock() {
  return (
    <div className='place-items-center'>
      <time
        className='font-roboto flex items-start gap-3.5 text-base tracking-[0.04em]'
        dateTime='2024-11-27T09:10:00'>
        <span>9:10</span>
        <span>Wed, Nov 27</span>
      </time>
    </div>
  )
}

function StatusSystemIndicators() {
  return (
    <ul className='flex place-items-end items-center justify-end gap-1.5'>
      {/* TODO: flesh out */}
      <li>
        <PlaceholderIcon
          className='size-4.5'
          role='img'
          aria-label='Battery status, 85% charged'
          id='battery-icon'
        />
      </li>

      <li>
        <Wifi
          className='size-4.5'
          fill='white'
          role='img'
          aria-label='Wifi connected, 2 bars'
          id='wifi-icon'
        />
      </li>
      <li>
        <Battery
          className='size-4.5'
          role='img'
          fill='white'
          aria-label='Battery status, 85% charged'
          tabIndex={0}
          id='bluetooth-icon'
        />
      </li>
    </ul>
  )
}
