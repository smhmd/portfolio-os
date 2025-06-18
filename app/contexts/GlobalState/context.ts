import { createContext, useContext } from 'react'

import { ensureContext } from 'app/utils'

export interface GlobalState {
  isAppDrawerOpen: React.RefObject<boolean>
}

export const GlobalStateContext = createContext<GlobalState | null>(null)

export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext)
  ensureContext(context)
  return context
}
