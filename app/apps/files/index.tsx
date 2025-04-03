import { AppWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { AppIcon } from './Icon'

export const metadata: AppMetadata = {
  id: 'files',
  name: 'Files',
  Icon: AppIcon,
}

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Files' }]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon />)
  return [favicon]
}

export default function App() {
  return <AppWrapper className=''>files</AppWrapper>
}
