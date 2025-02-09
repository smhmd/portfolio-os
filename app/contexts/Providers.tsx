import { CurrentAppProvider } from './CurrentApp'

type ProvidersProps = React.PropsWithChildren

export const Providers = ({ children }: ProvidersProps) => {
  return <CurrentAppProvider>{children}</CurrentAppProvider>
}
