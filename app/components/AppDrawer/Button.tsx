import clsx from 'clsx'
import { Dialog } from 'radix-ui'

type AppDrawerButtonProps = {
  isDark?: boolean
}

export const AppDrawerButton = ({ isDark }: AppDrawerButtonProps) => (
  <Dialog.Trigger
    aria-label='Open Applications Drawer'
    className={clsx(
      'fixed z-10',
      'bottom-4 left-4 sm:bottom-6 sm:left-6',
      'p-2 sm:p-3',
      'corner-shape-squircle supports-squircle:rounded-full',
      'rounded-lg bg-black/30 text-white shadow-lg backdrop-blur-lg',
      'cursor-pointer transition-transform hover:scale-105 active:scale-95',
      'border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      isDark
        ? 'border-white/10 focus-visible:ring-white focus-visible:ring-offset-black'
        : 'border-black/10 focus-visible:ring-black focus-visible:ring-offset-white',
    )}>
    <svg className='size-6' viewBox='0 0 24 24'>
      <path
        fill='currentColor'
        d='M12 17a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4M5 17a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7-7a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4M5 10a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7-7a2 2 0 1 1 0 4a2 2 0 0 1 0-4m7 0a2 2 0 1 1 0 4a2 2 0 0 1 0-4M5 3a2 2 0 1 1 0 4a2 2 0 0 1 0-4'
      />
    </svg>
  </Dialog.Trigger>
)
