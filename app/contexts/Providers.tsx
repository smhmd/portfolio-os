import { GlobalsProvider } from './Globals/Provider'

export const Providers = ({ children }: React.PropsWithChildren) => {
  return <GlobalsProvider>{children}</GlobalsProvider>
}
