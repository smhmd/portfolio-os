import clsx from 'clsx'

type Props = React.ComponentProps<'div'>

export function Base({ className, children, ref, ...props }: Props) {
  return (
    <div
      className={clsx('bg-base-border rounded p-px', className)}
      {...props}
      ref={ref}>
      <div className='bg-base rounded-ms relative grid size-full'>
        {children}
      </div>
    </div>
  )
}
