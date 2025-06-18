import { createContext, useContext } from 'react'

import type { AppMetadata } from 'app/lib'
import { ensureContext } from 'app/utils'

export const CurrentAppContext = createContext<AppMetadata | null>(null)

export const useCurrentApp = (): AppMetadata => {
  const context = useContext(CurrentAppContext)
  ensureContext(context)
  return context
}
