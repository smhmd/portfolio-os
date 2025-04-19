import { GlobalStateProvider } from './GlobalState/Provider'

type ProvidersProps = React.PropsWithChildren

export const Providers = ({ children }: ProvidersProps) => {
  return <GlobalStateProvider>{children}</GlobalStateProvider>
}
