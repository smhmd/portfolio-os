import { useEffect, useRef, useState } from 'react'

import { isServer } from 'src/lib/env'

import { GlobalsContext } from './context'

export const GlobalsProvider = ({ children }: React.PropsWithChildren) => {
  const isAppDrawerOpen = useRef(false)
  const isReducedMotion = useRef(false)

  const [dimensions, setDimensions] = useState(() => {
    if (isServer) return { width: 0, height: 0 }
    return { width: window.innerWidth, height: window.innerHeight }
  })

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    isReducedMotion.current = query.matches

    function handleQueryChange(e: MediaQueryListEvent) {
      isReducedMotion.current = e.matches
    }

    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    query.addEventListener('change', handleQueryChange, { signal })
    window.addEventListener('resize', handleResize, { signal })
    window.addEventListener('orientationchange', handleResize, { signal })

    return () => controller.abort()
  }, [])

  return (
    <GlobalsContext.Provider
      value={{
        isAppDrawerOpen,
        isReducedMotion,
        ...dimensions,
      }}>
      {children}
    </GlobalsContext.Provider>
  )
}
