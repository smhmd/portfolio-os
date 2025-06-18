import { GlobalStateProvider } from './GlobalState/Provider'

export const Providers = ({ children }: React.PropsWithChildren) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>
}
