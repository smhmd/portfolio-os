import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'monument-valley',
  name: 'Monument Valley',
  description: 'Meditative puzzle game of optical illusions',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='teal' {...props}>
      <g clipPath='url(#a)'>
        {/* <g fill='#A2F4FD'>
          <path fill='#6de5f2' d='m68.5 31 36.8 75.75H31.7z' />
          <path fill='#6de5f2' d='m31.5 31 36.8 75.75H-5.3z' />
          <path fill='#00b8cf' d='m19.5 21 36.8 75.75h-73.6z' />
          <path fill='#00b8cf' d='m80.5 21 36.8 75.75H43.7z' />
        </g> */}

        <path fill='#ff9b52' d='M80 75 50 92 20 75l30-17z' />
        <path fill='#ff5c18' d='M20 109V75l30 17v17z' />
        <path fill='#ff3d2a' d='M80 109V75L50 92v17z' />

        <path
          stroke='#fdfbf9'
          strokeLinecap='round'
          strokeWidth='2.832'
          d='M49.297 59.738c.054 7.255-1.411 14.913 1.768 14.659m2.929-17.401c.053 7.254-1.411 14.912 1.768 14.658'
        />
        <g filter='url(#b)' opacity='.4'>
          <path
            fill='#000'
            d='M52.014 77.84c5.568 0 10.082-1.952 10.082-4.36s-4.514-4.36-10.082-4.36-10.082 1.951-10.082 4.36c0 2.408 4.514 4.36 10.082 4.36'
          />
        </g>
        <g filter='url(#c)'>
          <path
            fill='#fdfbf9'
            d='M55.896 40.512c.149-1.386-4.653-2.622-5.21.246-.212 1.086-6.509 4.783-10.85 9.84-1.74 2.028-1.349 5.06.869 6.553 6.029 4.06 12.784 3.991 17.884 1.814 2.17-.926 2.767-3.546 1.827-5.711-2.309-5.323-4.64-11.632-4.52-12.742'
          />
        </g>
        <path
          fill='#251805'
          d='M53.674 39.261a7.567 7.567 0 1 0 0-15.134 7.567 7.567 0 0 0 0 15.134'
        />
        <path
          fill='#251805'
          d='M55.88 40.762c-.053 1.157-.702 1.332-2.685 1.257-1.982-.076-2.26-.916-2.508-1.257-.162-5.379 1.222-6.298 2.696-6.298s2.612 3.853 2.498 6.298'
        />
        <path
          fill='#fdfbf9'
          d='M56.266 38.41c2.747 0 4.975-3.006 4.975-6.716s-2.228-6.716-4.975-6.716c-2.748 0-4.976 3.007-4.976 6.716s2.228 6.717 4.976 6.717'
        />
        <path
          fill='#fdfbf9'
          d='M55.464 24.337C53.922 23.697 37.79 23.327 31 23c0 0 9.413 9.37 16.787 13.448.182-8.034 4.599-12.242 7.677-12.111'
        />
      </g>
      <defs>
        <filter
          id='b'
          width='43.953'
          height='32.508'
          x='30.038'
          y='57.225'
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'>
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
          <feGaussianBlur
            result='effect1_foregroundBlur_277_83'
            stdDeviation='5.947'
          />
        </filter>
        <filter
          id='c'
          width='34.558'
          height='33.885'
          x='32.519'
          y='35.62'
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'>
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset dy='2.832' />
          <feGaussianBlur stdDeviation='3.115' />
          <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0' />
          <feBlend
            in2='BackgroundImageFix'
            result='effect1_dropShadow_277_83'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_277_83'
            result='shape'
          />
        </filter>
        <clipPath id='a'>
          <path fill='#fff' d='M0 0h100v100H0z' />
        </clipPath>
      </defs>
    </AppIconWrapper>
  )
}
