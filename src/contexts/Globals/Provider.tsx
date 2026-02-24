import { useEffect, useRef, useState } from 'react'

import { GlobalsContext } from './context'

export const GlobalsProvider = ({ children }: React.PropsWithChildren) => {
  const isAppDrawerOpen = useRef(false)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  function handleResize() {
    setDimensions({ width: window.innerWidth, height: window.innerHeight })
  }

  useEffect(() => {
    const controller = new AbortController()
    handleResize()

    window.addEventListener('resize', handleResize, {
      signal: controller.signal,
    })
    window.addEventListener('orientationchange', handleResize, {
      signal: controller.signal,
    })

    return () => controller.abort()
  }, [])

  return (
    <GlobalsContext.Provider
      value={{
        isAppDrawerOpen,
        ...dimensions,
      }}>
      {children}
    </GlobalsContext.Provider>
  )
}
