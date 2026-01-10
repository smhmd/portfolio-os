import { useMemo } from 'react'
import { useLocation } from 'react-router'

import { type AppID, apps } from 'app/apps'

import { CurrentAppContext } from './context'

export const CurrentAppProvider = (props: React.PropsWithChildren) => {
  const location = useLocation()
  const currentApp = useMemo(() => {
    const currentAppId = location.pathname.match(/[^/]+/)?.[0] as
      | AppID
      | undefined
    return currentAppId ? apps[currentAppId] : undefined
  }, [location.pathname])

  return <CurrentAppContext.Provider value={currentApp} {...props} />
}
