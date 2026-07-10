import { CurrentAppProvider } from './CurrentApp/Provider'
import { GlobalsProvider } from './Globals/Provider'

export const Providers = ({ children }: React.PropsWithChildren) => {
  return (
    <GlobalsProvider>
      <CurrentAppProvider>{children}</CurrentAppProvider>
    </GlobalsProvider>
  )
}
