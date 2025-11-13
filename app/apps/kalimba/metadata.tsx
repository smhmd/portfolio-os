import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'kalimba',
  name: 'Kalimba',
  description: 'Play and record the kalimba',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='#111' {...props}>
      <path
        fill='#fff'
        d='M70 36.5c-2.7 0-4.8-4.6-3-6.5 1.4-1.5 3.4-1.2 5 .5 2.3 2.4 1 6-2 6M29 35c-1.4-1.2-1.5-3.5 0-5q2.3-2.3 4.5 0c1.4 1.4 1.3 3.5-.5 5q-2 1.8-4 0M38 50.5c1-4 5.5-8.3 10.5-9.5 5.6-1.3 10.5.8 13.5 6.5 2.9 5.5 2 13.6-2.5 19a16 16 0 0 1-9 4.5c-2.2 0-5.3-1.7-7.5-4a21 21 0 0 1-5-16.5'
      />
      <path
        fill='#ea5659'
        d='M17.5 49c-2.1-1.2-2.2-3.8 0-5.5q3.4-2.4 7 0c2.1 1.4 1.7 3.4-1 5q-3.2 2.1-6 .5M81 50c-4.1.8-8.3-3-6-5.5 1.8-2 4.8-2.3 7.5-1 3.9 1.9 3 5.7-1.5 6.5'
      />
    </AppIconWrapper>
  )
}
