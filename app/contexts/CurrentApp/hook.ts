import { createContext, useContext } from 'react'

import type { AppMetadata } from 'app/lib'

export const CurrentAppContext = createContext<AppMetadata | null>(null)

/**
 * @example const CurrentApp = useCurrentApp()
 */
export const useCurrentApp = () => {
  const ctx = useContext(CurrentAppContext)
  if (ctx === undefined) {
    throw new Error('useCurrentApp must be used within a CurrentAppProvider')
  }
  return ctx
}
