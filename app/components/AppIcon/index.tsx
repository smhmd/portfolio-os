type Props = React.ComponentProps<'svg'> & {
  padding?: number
}

export const AppIconWrapper = ({
  padding = 0,
  fill = 'url(#fill)', // can be used to add interesting fills
  children,
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
      </defs>
    </svg>
  )
}
