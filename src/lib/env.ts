export const SHOW_APP_DRAWER = true
export const SHOW_TAILWIND_BREAKPOINTS = false
export const GITHUB_REPO = 'smhmd/portfolio-os'
export const REPO_LINK = `https://github.com/${GITHUB_REPO}/`
export const DOMAIN = `https://www.smhmd.workers.dev`

const MOBILE_REGEX =
  /iPhone|iPod|iPad|\bAndroid|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i

export const isClient = typeof window !== 'undefined'
export const isServer = typeof window === 'undefined'

export const isMobile = isClient && MOBILE_REGEX.test(navigator.userAgent)
export const isDesktop = !isMobile
