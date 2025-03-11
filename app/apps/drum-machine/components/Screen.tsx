import clsx from 'clsx'

export function Screen(props: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'col-span-8 row-span-4',
        'bg-screen-border font-silkscreen text-white',
        'rounded p-px',
      )}>
      <div
        className='bg-screen rounded-ms grid size-full place-items-center'
        {...props}
      />
    </div>
  )
}
