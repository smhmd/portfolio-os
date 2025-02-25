import clsx from 'clsx'

type Props = React.ComponentProps<'div'>

export function Base({ className, children, ...props }: Props) {
  return (
    <div className={clsx('bg-base-border rounded p-px', className)} {...props}>
      <div className='bg-base rounded-ms relative grid size-full'>
        {children}
      </div>
    </div>
  )
}
