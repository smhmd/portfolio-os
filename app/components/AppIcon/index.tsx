type Props = React.ComponentProps<'svg'> & {
  padding?: number
  wip?: boolean
}

export const AppIconWrapper = ({
  padding = 0,
  fill = 'url(#fill)', // can be used to add interesting fills
  children,
  wip = false,
  ...props
}: Props) => {
  const size = 100 - padding * 2
  const viewBox = `${padding} ${padding} ${size} ${size}`

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='#ffffff33'
      viewBox={viewBox}
      {...props}>
      <g clipPath='url(#app-icon)'>
        <rect width='100' height='100' fill={fill} />
        {children}
        {wip ? (
          <g>
            <rect
              x='60'
              y='73'
              width='40'
              height='15'
              fill='url(#app-icon-banner)'
              rx='2'
            />
            <text
              x='90'
              y='83'
              textAnchor='end'
              fontSize='8'
              fontWeight='bold'
              fill='#fff'
              fontFamily='sans-serif'
              filter='url(#app-icon-banner-shadow)'>
              BETA
            </text>
          </g>
        ) : null}
      </g>
    </svg>
  )
}

export function AppIconShape() {
  return (
    <svg
      width='0'
      height='0'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden>
      <defs>
        <clipPath id='app-icon'>
          <path d='M0 50C0 13.636 13.636 0 50 0c36.364 0 50 13.636 50 50 0 36.364-13.636 50-50 50-36.364 0-50-13.636-50-50Z' />
        </clipPath>
        <linearGradient id='app-icon-banner' x1='100%' y1='0' x2='0' y2='0'>
          <stop offset='0%' stopColor='orange' stopOpacity='1' />
          <stop offset='100%' stopColor='orange' stopOpacity='0' />
        </linearGradient>
        <filter id='app-icon-banner-shadow'>
          <feDropShadow
            dx='1'
            dy='1'
            stdDeviation='1'
            floodColor='black'
            floodOpacity='0.3'
          />
        </filter>
      </defs>
    </svg>
  )
}
