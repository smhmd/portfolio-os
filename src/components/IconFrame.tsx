type Props = React.ComponentProps<'svg'> & {
  padding?: number
  wip?: boolean
}

export function IconFrame({
  padding = 0,
  fill = 'url(#fill)', // can be used to add interesting fills
  children,
  wip = false,
  ...props
}: Props) {
  const size = 100 - padding * 2
  const viewBox = `${padding} ${padding} ${size} ${size}`

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='#ffffff33'
      viewBox={viewBox}
      {...props}>
      <g clipPath='url(#app-icon-clip)'>
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
        <use
          href='#app-icon-shape'
          fill='none'
          stroke='rgba(255,255,255,.20)'
          strokeWidth='2'
        />
      </g>
    </svg>
  )
}
