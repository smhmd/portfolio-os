import { useRef } from 'react'

import { GlobalStateContext } from './context'

export const GlobalStateProvider = ({ children }: React.PropsWithChildren) => {
  const isAppDrawerOpen = useRef(false)

  return (
    <GlobalStateContext.Provider
      value={{
        isAppDrawerOpen,
      }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
