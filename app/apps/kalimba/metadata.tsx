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
    <AppIconWrapper fill='#615fff' {...props} wip>
      <circle cx='50' cy='61' r='21' fill='#000' />
      <g fill='white' transform='translate(0, -4)'>
        <rect width='11' height='44' x='6' rx='5.5' />
        <rect width='11' height='50' x='19' rx='5.5' />
        <rect width='11' height='56' x='32' rx='5.5' />
        <rect width='11' height='62' x='45' rx='5.5' />
        <rect width='11' height='56' x='58' rx='5.5' />
        <rect width='11' height='50' x='71' rx='5.5' />
        <rect width='11' height='44' x='84' rx='5.5' />
      </g>
    </AppIconWrapper>
  )
}
