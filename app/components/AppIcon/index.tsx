export function AppIcon({ children, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='#ffffff33'
      viewBox='0 0 100 100'
      {...props}>
      <g clipPath='url(#app-icon)'>
        <rect width='100' height='100' />
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
      xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <clipPath id='app-icon'>
          <path d='M0 50C0 13.636 13.636 0 50 0c36.364 0 50 13.636 50 50 0 36.364-13.636 50-50 50-36.364 0-50-13.636-50-50Z' />
        </clipPath>
      </defs>
    </svg>
  )
}
