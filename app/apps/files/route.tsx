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
  const favicon = iconToFavicon(<AppIcon />)
  return [favicon]
}

export default function App() {
  return <AppWrapper className=''>files</AppWrapper>
}
