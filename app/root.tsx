import {
  type ErrorResponse,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from 'react-router'

import {
  AppDrawer,
  AppIconShape,
  BreakpointDisplay,
  BSOD,
} from 'app/components'
import { Providers } from 'app/contexts'
import mainCSS from 'app/styles/main.css?url'

import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  { rel: 'manifest', href: '/site.webmanifest' },
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

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang='en' className='touch-none select-none'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='antialiased'>
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
  const location = useLocation()
  const isApp = location.pathname !== '/'

  return (
    <Providers>
      {isApp && (
        <nav>
          <AppDrawer />
        </nav>
      )}
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
