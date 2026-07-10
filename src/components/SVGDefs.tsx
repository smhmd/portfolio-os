export function SVGDefs() {
  return (
    <svg
      width='0'
      height='0'
      viewBox='0 0 100 100'
      aria-hidden
      preserveAspectRatio='none'>
      <defs>
        {/* square-rounded clip path for icons */}
        <path
          id='app-icon-shape'
          d='M0 50C0 13.636 13.636 0 50 0c36.364 0 50 13.636 50 50 0 36.364-13.636 50-50 50-36.364 0-50-13.636-50-50Z'
        />

        <clipPath id='app-icon-clip'>
          <use href='#app-icon-shape' />
        </clipPath>

        {/* gradient for "beta" banner on WIP apps */}
        <linearGradient id='app-icon-banner' x1='100%' y1='0' x2='0' y2='0'>
          <stop offset='0%' stopColor='orange' stopOpacity='1' />
          <stop offset='100%' stopColor='orange' stopOpacity='0' />
        </linearGradient>

        {/* shadow for "beta" banner */}
        <filter id='app-icon-banner-shadow'>
          <feDropShadow
            dx='1'
            dy='1'
            stdDeviation='1'
            floodColor='black'
            floodOpacity='0.3'
          />
        </filter>

        {/* inner shadow for backgrounds to darken the edges */}
        <filter id='vignette' colorInterpolationFilters='sRGB'>
          <feBlend result='shape' />
          <feColorMatrix
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feGaussianBlur stdDeviation='40' />
          <feComposite in2='hardAlpha' k2='-1' k3='1' operator='arithmetic' />
          <feBlend in2='shape' />
        </filter>

        {/* light coming from above effect for ornaments */}
        <filter id='light-from-above' colorInterpolationFilters='sRGB'>
          <feBlend result='shape' />
          <feColorMatrix
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset dx='1' dy='2' />
          <feGaussianBlur stdDeviation='1' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.66 0' />
          <feBlend mode='overlay' in2='shape' />
        </filter>

        {/* Bronze radial for ornaments */}
        <radialGradient id='bronze-radial' cx='0.5' cy='0.5' r='0.8'>
          <stop offset='0%' stopColor='#c5804b' />
          <stop offset='100%' stopColor='#603f26' />
        </radialGradient>

        {/* Scatter to make a shadow */}
        <filter id='scatter' filterUnits='userSpaceOnUse'>
          <feFlood floodOpacity='0' />
          <feBlend in='SourceGraphic' result='shape' />
          <feGaussianBlur stdDeviation='5' />
        </filter>
      </defs>
    </svg>
  )
}
