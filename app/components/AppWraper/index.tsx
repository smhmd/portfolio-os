import clsx from 'clsx'

type AppWraperProps = {
  fullscreen?: boolean
} & React.ComponentProps<'main'>

export function AppWraper({ fullscreen, className, ...props }: AppWraperProps) {
  return (
    <main
      className={clsx('h-screen', fullscreen || 'pb-18 pt-10', className)}
      {...props}
    />
  )
}
