import { Base } from './Base'

export function Speaker() {
  return (
    <Base className='col-span-4 row-span-4'>
      <svg
        className='place-self-center p-4'
        xmlns='http://www.w3.org/20/svg'
        viewBox='-3.5 -3.5 127 127'
        fill='none'>
        <defs>
          <filter
            id='blur'
            x='-3.8'
            y='-3.8'
            width='7.6'
            height='7.6'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'>
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='BackgroundImageFix'
              result='shape'
            />
            <feGaussianBlur
              stdDeviation='0.15'
              result='effect1_foregroundBlur'
            />
          </filter>
          <linearGradient
            id='gradient'
            x1='-3'
            y1='-2'
            x2='2.5'
            y2='2.5'
            gradientUnits='userSpaceOnUse'>
            <stop stopColor='#404040' /> <stop offset='1' stopColor='white' />
          </linearGradient>
          <g id='hole'>
            <g filter='url(#blur)'>
              <circle cx='0' cy='0' r='3' fill='#192024' />
              <circle
                cx='0'
                cy='0'
                r='3.25'
                stroke='url(#gradient)'
                strokeWidth='0.5'
              />
            </g>
          </g>
        </defs>

        {Array.from({ length: 13 }).map((_, y) =>
          Array.from({ length: 13 }).map((_, x) => {
            const key = `${y},${x}`
            if (ignore.has(key)) return null
            return (
              <use
                key={key}
                href='#hole'
                transform={`translate(${x * 10} ${y * 10})`}
              />
            )
          }),
        )}
      </svg>
    </Base>
  )
}

// L shaped cutout of the hole pattern on each corner
const ignore = new Set([
  '0,0',
  '0,1',
  '0,2',
  '0,10',
  '0,11',
  '0,12',
  '1,0',
  '1,12',
  '2,0',
  '2,12',
  '10,0',
  '10,12',
  '11,0',
  '11,12',
  '12,0',
  '12,1',
  '12,2',
  '12,10',
  '12,11',
  '12,12',
])
