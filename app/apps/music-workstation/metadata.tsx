import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'music-workstation',
  name: 'Music Workstation',
  description: 'OP-1 Field drum machine',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='#979797' wip {...props}>
      <defs colorInterpolationFilters='sRGB'>
        <filter id='darken'>
          <feComponentTransfer>
            <feFuncR type='linear' slope='0.75' />
            <feFuncG type='linear' slope='0.75' />
            <feFuncB type='linear' slope='0.75' />
          </feComponentTransfer>
        </filter>

        <filter id='lighten'>
          <feComponentTransfer>
            <feFuncR type='linear' slope='0.62' intercept='0.38' />
            <feFuncG type='linear' slope='0.62' intercept='0.38' />
            <feFuncB type='linear' slope='0.62' intercept='0.38' />
          </feComponentTransfer>
        </filter>
      </defs>

      <ellipse cx='50.5' cy='62' fill='#A1A3A5' rx='32.5' ry='25' />
      <ellipse cx='50.5' cy='59' fill='#CDD0C3' rx='32.5' ry='25' />
      <path
        fill='#B7B9B4'
        d='M67 80.54C62.163 82.737 56.524 84 50.5 84c-6.024 0-11.663-1.263-16.5-3.46V60h33v20.54Z'
      />
      <path
        fill='#6C7A84'
        d='M34 59.986V42.014C34 35.93 41.387 31 50.5 31S67 35.931 67 42.014v17.971C67 66.07 59.613 71 50.5 71S34 66.069 34 59.986Z'
      />
      <path
        fill='#A1A3A5'
        d='M31 54.232V31.768C31 24.164 39.954 18 51 18s20 6.164 20 13.768v22.464C71 61.836 62.046 68 51 68s-20-6.164-20-13.768Z'
      />
      <ellipse cx='51' cy='32' fill='#CDD0C3' rx='20' ry='16' />

      <ellipse
        cx='50.5'
        cy='28.5'
        fill='#EF3E23'
        filter='url(#darken)'
        rx='16.5'
        ry='12.5'
      />
      <g className='transition-transform group-hover/icon:translate-y-[3px]'>
        <ellipse cx='50.5' cy='25.5' fill='#EF3E23' rx='16.5' ry='12.5' />
        <path
          fill='#EF3E23'
          filter='url(#lighten)'
          d='M34 25.5c0-1.64.43-3.27 1.26-4.78.83-1.52 2.04-2.9 3.57-4.06a17.58 17.58 0 0 1 5.36-2.7 21.17 21.17 0 0 1 12.62 0c2 .62 3.83 1.54 5.36 2.7a12.91 12.91 0 0 1 3.57 4.06A9.93 9.93 0 0 1 67 25.5l-3.02-1.67a8.52 8.52 0 0 0-.86-2.29c-.69-1.25-1.7-2.4-2.96-3.36a14.55 14.55 0 0 0-4.43-2.24 17.52 17.52 0 0 0-10.46 0 14.55 14.55 0 0 0-4.43 2.24c-1.26.97-2.27 2.1-2.96 3.36-.4.74-.69 1.5-.86 2.3L34 25.5Z'
        />
      </g>
    </AppIconWrapper>
  )
}
