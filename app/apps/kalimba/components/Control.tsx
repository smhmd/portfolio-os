import clsx from 'clsx'
import { Dialog } from 'radix-ui'

import { Close } from '~/assets'
import type { Props } from '~/lib'

type ControlProps = Props<'span', { name: string; value?: string | number }>

export function Control({
  name,
  value = '',
  children,
  ...props
}: ControlProps) {
  return (
    <li className='w-full'>
      <Dialog.Root>
        <Dialog.Trigger
          className={clsx(
            'group flex w-full items-center justify-between',
            'active:bg-white/3 hover:bg-white/2 cursor-pointer',
            'focus-visible:bg-white/2 px-6 py-3 outline-none',
          )}>
          <span className='w-full text-left capitalize tracking-wider'>
            {name}
          </span>
          <span className='flex size-12 shrink-0 items-center justify-center whitespace-pre font-semibold'>
            <span {...props}>{value}</span>
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay
            className={clsx(
              'fixed inset-0 z-20 bg-black/60',
              'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
            )}
          />
          <Dialog.Content
            className={clsx(
              'rounded-4xl fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2',
              'w-full max-w-[34rem] bg-neutral-900',
              'font-quicksand text-2.5xl tracking-wider outline-none',
              'data-[state=open]:animate-grow-in data-[state=closed]:animate-grow-out',
            )}>
            <section className='pt-5.5 relative flex flex-col gap-y-14 px-8 pb-10'>
              <Dialog.Title className='text-center capitalize'>
                {name}
              </Dialog.Title>
              <Dialog.Description className='sr-only'>
                {/* TODO: FILL THIS DEPENDING ON INPUT TYPE */}
                Edit {name}
              </Dialog.Description>
              {children}
              <Dialog.Close
                aria-label='Close'
                className={clsx(
                  'absolute right-4 top-4 cursor-pointer rounded-full p-2',
                  'outline-none',
                  'hover:rotate-90 hover:bg-white/20 focus-visible:rotate-90 focus-visible:bg-white/20',
                  'transition-all duration-300',
                )}>
                <Close className='size-10 fill-current' aria-hidden />
              </Dialog.Close>
            </section>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </li>
  )
}
