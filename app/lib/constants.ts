export const SHOW_TAILWIND_BREAKPOINTS = false
export const GITHUB_REPO = 'smhmd/portfolio-os'
export const REPO_LINK = `https://github.com/${GITHUB_REPO}/`

export const isClient = typeof window !== 'undefined'
export const isServer = typeof window === 'undefined'

export const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  )

type Tier = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Device GPU tier detection (0 = very low, 3 = high)
 */
export const gpuTier = await new Promise<Tier>((resolve) => {
  if (!isClient) resolve(0)

  const durationMs = 500
  let frames = 0
  const start = performance.now()

  function loop() {
    frames++
    const now = performance.now()
    if (now - start < durationMs) {
      requestAnimationFrame(loop)
    } else {
      const fps = frames / ((now - start) / 1000)
      // Map fps 0–120 linearly to tier 0–5
      const tier = Math.min(5, Math.floor((fps / 120) * 6)) as Tier
      resolve(tier)
    }
  }

  requestAnimationFrame(loop)
})

// Geometry
export const PI = Math.PI
export const TAU = Math.PI * 2

export const HALF_PI = Math.PI / 2
export const THIRD_PI = Math.PI / 3
export const QUARTER_PI = Math.PI / 4
export const THREE_QUARTER_PI = (3 * Math.PI) / 4
