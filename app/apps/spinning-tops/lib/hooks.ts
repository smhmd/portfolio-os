import { createContext, useContext } from 'react'

interface ViewportContextType {
  width: number
  height: number
  scaleFactor: number
  centerX: number
  centerY: number
}

export const ViewportContext = createContext<ViewportContextType | undefined>(
  undefined,
)

export const useViewport = () => {
  const context = useContext(ViewportContext)
  if (!context) {
    throw new Error('useViewport must be used within a ViewportProvider')
  }
  return context
}
