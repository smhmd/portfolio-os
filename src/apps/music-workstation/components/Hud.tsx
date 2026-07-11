import clsx from 'clsx'

/**
 * The readout band along the top of every screen. Fixed height, normal flow —
 * the graphics area below can never collide with it.
 */
export function Hud({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'flex h-11 shrink-0 items-center justify-between px-4',
        className,
      )}
      {...props}
    />
  )
}

/** A small uppercase caption, OP-1 Field style. */
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className='text-[9px] uppercase leading-none tracking-[0.25em] opacity-60'>
      {children}
    </span>
  )
}

/** One readout: a big thin value with its caption. */
export function Item({
  label,
  color,
  children,
}: {
  label?: string
  color?: string
  children: React.ReactNode
}) {
  return (
    <div className='flex items-baseline gap-2' style={{ color }}>
      <span className='text-2xl font-thin tabular-nums leading-none'>
        {children}
      </span>
      {label ? <Label>{label}</Label> : null}
    </div>
  )
}
