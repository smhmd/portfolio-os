import clsx from 'clsx'

import type { Props } from 'src/lib/types'

type StickyNoteProps = Props<'div'>

export function StickyNote({ className, children, ...props }: StickyNoteProps) {
  return (
    <section
      className={clsx(
        'init:relative w-full max-w-sm',
        'rotate-2 transition-transform focus-within:rotate-0',
        className,
      )}
      {...props}>
      <div
        className={clsx(
          'relative flex size-full',
          'aspect-square overflow-hidden',
          'shadow-md shadow-yellow-800/10',
          'corner-[squircle_square_bevel_squircle]',
          'rounded-1.5xl rounded-br-5xl',
        )}>
        <span
          className={clsx(
            'h-full w-10',
            'bg-size-[100%_32px] bg-repeat-y',
            'bg-radial-[circle,#0000_10px,#E9E7DA_0]',
          )}
        />
        <div className='size-full bg-[#E9E7DA]'>{children}</div>
        <span
          className={clsx(
            'corner-bevel rounded-br-full',
            'absolute bottom-0 right-0 size-12',
            'bg-[#c7c5b9]',
          )}
        />
      </div>
      <div className='hidden'>
        <Bookmark className='-right-13 absolute top-0 h-12' />
        <Bookmark className='top-33 absolute -right-14 h-12' />
        <Bookmark className='top-47 absolute -right-9 h-12' />
      </div>
    </section>
  )
}

function Bookmark(props: Props<'svg'>) {
  return (
    <svg fill='none' viewBox='0 0 106 55' {...props}>
      <path
        filter='url(#scatter)'
        fill='#101010'
        fillOpacity='.2'
        d='M96 16H10v29h86z'
      />
      <path
        fill='#d55816'
        d='M40.7 44.5c-.3-9 0-20.6-.2-31.3-10.8 1-21-.5-32-.5a515 515 0 0 0-.3 30.8c.2.5 16 2.4 32.5 1'
      />
      <path
        fill='#fbc604'
        d='M40.7 44.5 46 44c14.5-1.9 55-13.4 55.6-14 .9-.9.5-29.5 0-30-.2-.1-7.5 1.6-17 3.8-14.6 3.4-34.4 8-41.4 9l-2.6.4.1 15.8z'
      />
    </svg>
  )
}
