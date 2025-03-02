import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router'

import { type AppID, apps } from 'app/apps'
import type { AppMetadata } from 'app/lib'

export const CurrentAppContext = createContext<AppMetadata | null>(null)

export const CurrentAppProvider = (props: Props) => {
  const location = useLocation()
  const currentApp = useMemo(() => {
    const currentAppId = location.pathname.match(/[^/]+/)?.[0] as
      | AppID
      | undefined
    return currentAppId ? apps[currentAppId] : null
  }, [location.pathname])

  return <CurrentAppContext.Provider value={currentApp} {...props} />
}

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

type Props = React.PropsWithChildren<unknown>
