export const SHOW_TAILWIND_BREAKPOINTS = false
export const GITHUB_REPO = 'smhmd/portfolio-os'
export const REPO_LINK = `https://github.com/${GITHUB_REPO}/`

export const isClient = typeof window !== 'undefined'
export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )
