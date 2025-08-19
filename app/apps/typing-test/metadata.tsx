import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'typing-test',
  name: 'Typing Test',
  description: 'Test your typing speed and accuracy',
  Icon: AppIcon,
}

const keys = [
  { y: 35.5, x: 19, length: 8 },
  { y: 44, x: 19, length: 8 },
  { y: 52, x: 23, length: 7 },
].flatMap(({ length, y, x }) =>
  Array.from({ length }, (_, i) => ({ y, x: x + i * 8 })),
)

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='white' {...props}>
      <g className='group-hover/icon:animate-tilt origin-center'>
        <rect width='72' height='40' x='14' y='30' fill='#222' rx='4' />

        {keys.map(({ x, y }) => (
          <rect
            key={`${x}-${y}`}
            width='6'
            height='6'
            fill='#EEE'
            rx='2'
            x={x}
            y={y}
          />
        ))}

        <rect width='8' height='6' fill='#EEE' rx='2' x='26' y='60' />
        <rect width='28' height='6' fill='#EEE' rx='2' x='36' y='60' />
        <rect width='8' height='6' fill='#EEE' rx='2' x='66' y='60' />
      </g>
    </AppIconWrapper>
  )
}
