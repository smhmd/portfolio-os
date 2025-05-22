import React, { useEffect, useMemo, useState } from 'react'

import { ViewportContext } from '../lib'

interface ViewportProviderProps {
  children?: React.ReactNode
}

export const ViewportProvider = ({ children }: ViewportProviderProps) => {
  const [{ width, height }, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const controller = new AbortController()
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
    }

    handleResize()
    ;['resize', 'orientationchange'].forEach((event) =>
      window.addEventListener(event, handleResize, {
        signal: controller.signal,
      }),
    )

    return () => controller.abort()
  }, [])

  const value = useMemo(
    () => ({
      scaleFactor: 0.00098 * Math.min(width, height),
      centerX: width / 2,
      centerY: height / 2,
    }),
    [width, height],
  )

  return (
    <ViewportContext.Provider value={{ ...value, width, height }}>
      {children}
    </ViewportContext.Provider>
  )
}
