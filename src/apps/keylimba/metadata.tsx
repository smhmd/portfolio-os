import { IconFrame } from 'src/components'
import type { AppMetadata } from 'src/lib/types'

export const metadata: AppMetadata = {
  id: 'keylimba',
  name: 'Keylimba',
  description: 'Play the kalimba in any key',
  type: 'music',
  Icon: AppIcon,
  dark: true,
}

export function AppIcon(props: React.ComponentProps<typeof IconFrame>) {
  return (
    <IconFrame fill='#111' {...props}>
      <path
        fill='#fff'
        d='M70 36.5c-2.7 0-4.8-4.6-3-6.5 1.4-1.5 3.4-1.2 5 .5 2.3 2.4 1 6-2 6M29 35c-1.4-1.2-1.5-3.5 0-5q2.3-2.3 4.5 0c2.8 2.8-1.5 7.7-4.5 5m9 15.5c1-4 5.5-8.3 10.5-9.5 19.1-4.6 20 30 2 30-8.8 0-14.3-13.4-12.5-20.5'
      />
      <path
        fill='#ea5659'
        d='M17.5 49c-2.1-1.2-2.2-3.8 0-5.5q3.4-2.4 7 0c2.1 1.4 1.7 3.4-1 5q-3.2 2.1-6 .5M75 44.5c-2.3 2.5 1.9 6.3 6 5.5 8.8-1.7-.8-11.2-6-5.5'
      />
    </IconFrame>
  )
}
