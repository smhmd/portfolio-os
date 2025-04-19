import {
  type ErrorResponse,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import { AppIconShape, BreakpointDisplay, BSOD } from 'app/components'
import { Providers } from 'app/contexts'
import mainCSS from 'app/styles/main.css?url'

import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
  },
  { rel: 'stylesheet', href: mainCSS },
]

type Props = React.PropsWithChildren

export function Layout({ children }: Props) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='select-none antialiased'>
        {children}
        <AppIconShape />
        <ScrollRestoration />
        <BreakpointDisplay />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Providers>
      <Outlet /> {/* Apps go here */}
    </Providers>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let e: ErrorResponse = {
    status: 499,
    statusText: 'CLIENT_CRASHED',
    data: undefined,
  }

  if (isRouteErrorResponse(error)) {
    e = error
  } else if (error instanceof Error) {
    e = {
      status: 499,
      statusText: error.message,
      data: error.stack,
    }
  }

  return <BSOD error={e} />
}
