import { lazy, Suspense } from 'react'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { AppIcon, metadata } from './metadata'

export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon padding={8} />)
  return [favicon]
}

const Scene = lazy(() => import('./components/Scene'))

export default function App() {
  return (
    <AppWrapper>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </AppWrapper>
  )
}
