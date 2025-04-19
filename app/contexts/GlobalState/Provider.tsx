import { useRef } from 'react'

import { Context } from './hook'

interface Props {
  children: React.ReactNode
}

export const GlobalStateProvider = ({ children }: Props) => {
  const isAppDrawerOpen = useRef(false)

  return (
    <Context.Provider
      value={{
        isAppDrawerOpen,
      }}>
      {children}
    </Context.Provider>
  )
}
