import { useMemo } from 'react'
import { useLocation } from 'react-router'

import { type AppID, apps } from 'app/apps'

import { CurrentAppContext } from './hook'

type Props = React.PropsWithChildren<unknown>

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
