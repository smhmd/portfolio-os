import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'drum-machine',
  name: 'Music Workstation',
  description: 'OP-1 Field drum machine',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper strokeWidth={1} fill='#979797' {...props}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='100'
        height='100'
        fill='none'>
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
        <ellipse cx='50.5' cy='28.5' fill='#BF2026' rx='16.5' ry='12.5' />
        <g className='transition-transform group-hover/icon:translate-y-[3px]'>
          <ellipse cx='50.5' cy='25.5' fill='#EF3E23' rx='16.5' ry='12.5' />
          <path
            fill='#F48180'
            d='M34 25.5c0-1.642.427-3.267 1.256-4.784.83-1.516 2.045-2.894 3.577-4.055 1.532-1.16 3.35-2.081 5.353-2.71A21.168 21.168 0 0 1 50.5 13c2.167 0 4.312.323 6.314.951 2.002.629 3.821 1.55 5.353 2.71 1.532 1.16 2.748 2.539 3.577 4.055C66.574 22.233 67 23.858 67 25.5l-3.022-1.667a8.515 8.515 0 0 0-.861-2.292c-.686-1.255-1.692-2.396-2.96-3.357-1.268-.96-2.774-1.722-4.43-2.242a17.52 17.52 0 0 0-5.227-.788c-1.793 0-3.57.268-5.226.788-1.657.52-3.163 1.282-4.43 2.242-1.269.961-2.275 2.102-2.961 3.357a8.515 8.515 0 0 0-.861 2.292L34 25.5Z'
          />
        </g>
      </svg>
    </AppIconWrapper>
  )
}
