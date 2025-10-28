import { createContext, useContext } from 'react'

import { ensureContext } from 'app/utils'

export interface Globals {
  isAppDrawerOpen: React.RefObject<boolean>
  width: number
  height: number
}

export const GlobalsContext = createContext<Globals | null>(null)

export const useGlobals = (): Globals => {
  const context = useContext(GlobalsContext)
  ensureContext(context)
  return context
}
