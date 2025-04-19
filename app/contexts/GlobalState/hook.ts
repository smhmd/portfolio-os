import { useContext } from 'react'
import { createContext } from 'react'

export interface ProviderValue {
  isAppDrawerOpen: React.MutableRefObject<boolean>
}

export const Context = createContext<ProviderValue | undefined>(undefined)

export const useGlobalState = (): ProviderValue => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useGlobalState must be used within an GlobalStateProvider')
  }

  return context
}
