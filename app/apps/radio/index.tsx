import { AppWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'
import { iconToFavicon } from 'app/utils'

import { AppIcon } from './Icon'

export const metadata: AppMetadata = {
  id: 'radio',
  name: 'Radio',
  Icon: AppIcon,
}

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Radio' }]
}

export function links() {
  const favicon = iconToFavicon(<AppIcon />)
  return [favicon]
}

export default function Radio() {
  return <AppWrapper className=''>Radio</AppWrapper>
}
