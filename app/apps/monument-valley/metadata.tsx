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
    <AppIconWrapper fill='tomato' {...props} wip>
      <g clipPath='url(#a)'>
        <path
          fill='#e54d57'
          d='M72.715 77.247v7.184L56.78 96.404h-9.56L31.285 84.431v-7.184L47.22 65.274h9.56z'
        />
        <path
          fill='#ffb3b2'
          d='M72.715 70.208v7.183L56.781 89.366H47.22L31.285 77.39v-7.183L47.22 58.234h9.56z'
        />
        <path
          fill='#8b897e'
          d='M67.086 71.01v5.388l-11.952 8.98h-7.17l-11.95-8.98-.001-5.388 11.95-8.98h7.171z'
        />
        <path
          fill='#f6e9d7'
          d='M58.726 72.363v2.49L53.206 79h-3.313l-5.52-4.148v-2.49l5.52-4.147h3.313z'
        />
        <g filter='url(#b)' opacity='.4'>
          <path
            fill='#000'
            d='M52.014 77.84c5.568 0 10.082-1.952 10.082-4.36s-4.514-4.36-10.082-4.36-10.082 1.951-10.082 4.36c0 2.408 4.514 4.36 10.082 4.36'
          />
        </g>
        <path
          stroke='#fdfbf9'
          strokeLinecap='round'
          strokeWidth='2.832'
          d='M49.297 59.738c.054 7.255-1.411 14.913 1.768 14.659m2.929-17.401c.053 7.254-1.411 14.912 1.768 14.658'
        />
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
        <path fill='#f96478' d='M47.221 89.363h9.553v7.047h-9.553z' />
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
