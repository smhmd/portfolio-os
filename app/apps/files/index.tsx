import { AppIcon, AppWraper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Files' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [favicon]
}

export const metadata: AppMetadata = {
  id: 'files',
  name: 'Files',
  Icon: (props) => (
    <AppIcon fill='#FF9D17' {...props}>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M30.349 34.848h21.136l-.955-3.318a4.545 4.545 0 0 0-4.545-3.227H27.439a4.546 4.546 0 0 0-4.545 4.545v9.41a7.411 7.411 0 0 1 7.455-7.41Z'
        fill='#FFCB83'
      />
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M72.894 72.03H27.439a4.546 4.546 0 0 1-4.545-4.545V39.394a4.545 4.545 0 0 1 4.546-4.546h45.454a4.546 4.546 0 0 1 4.545 4.546v28.09a4.546 4.546 0 0 1-4.545 4.546Z'
        fill='#fff'
      />
    </AppIcon>
  ),
  isDarkThemed: false,
}

export default function Files() {
  return <AppWraper className=''>files</AppWraper>
}
