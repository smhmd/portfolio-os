import { AppIconWrapper } from 'app/components'

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='#FF0045' {...props}>
      <path
        d='M70.182 27.637H29.818A9.818 9.818 0 0 0 20 37.455v25.09a9.818 9.818 0 0 0 9.818 9.819h40.364A9.818 9.818 0 0 0 80 62.546V37.455a9.818 9.818 0 0 0-9.818-9.818ZM50 60.909A10.909 10.909 0 1 1 60.91 50 10.864 10.864 0 0 1 50 60.91Zm18.182-16.09a6 6 0 1 1 0-12.002 6 6 0 0 1 0 12.002Z'
        fill='#fff'
      />
    </AppIconWrapper>
  )
}
