import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'dice-roll',
  name: 'Dice Roll',
  description: 'Roll Dice from d4 to d20',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='#222' {...props}>
      <g stroke='#fff' fill='#222'>
        <path d='m77.965 57.997-7.028-28.188-27.965-7.997-20.937 20.191 7.028 28.188 27.965 7.996 20.937-20.19Z' />
        <path d='m68.9 57.055 2.037-27.244-25.32 2.61-23.582 9.583 14.589 23.1L57.029 78.19 68.9 57.055Z' />
        <path d='m68.901 57.054-32.278 8.048m32.278-8.048L45.617 32.418l-8.994 32.684m32.278-8.048 9.064.943m-41.342 7.105-7.56 5.087m16.554-37.768-2.644-10.608' />
      </g>
    </AppIconWrapper>
  )
}
