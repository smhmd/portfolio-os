import { AppIcon, AppWraper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Gallery' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [favicon]
}

export default function App() {
  return <AppWraper>Gallery</AppWraper>
}

export const metadata: AppMetadata = {
  id: 'gallery',
  name: 'Gallery',
  Icon: (props) => (
    <AppIcon fill='#FF003C' {...props}>
      <path
        d='M71 53.773A42.047 42.047 0 0 0 57.363 50 42.047 42.047 0 0 0 71 46.227a7.273 7.273 0 0 0 .76-12.024 7.227 7.227 0 0 0-8.124-.476 41.862 41.862 0 0 0-10 9.728 40.91 40.91 0 0 0 3.455-13.637 7.227 7.227 0 1 0-14.455 0 40.91 40.91 0 0 0 3.455 13.637 41.86 41.86 0 0 0-9.728-9.728 7.227 7.227 0 0 0-10 2.637A7.273 7.273 0 0 0 29 46.227 42.047 42.047 0 0 0 42.636 50 42.047 42.047 0 0 0 29 53.773a7.273 7.273 0 0 0-.76 12.024 7.227 7.227 0 0 0 8.123.476 41.86 41.86 0 0 0 10-9.728 40.91 40.91 0 0 0-3.454 13.637 7.227 7.227 0 1 0 14.454 0 40.91 40.91 0 0 0-3.454-13.637 41.864 41.864 0 0 0 9.727 9.728 7.227 7.227 0 0 0 10-2.637A7.273 7.273 0 0 0 71 53.773Zm-21 1.045A4.818 4.818 0 1 1 54.818 50 4.864 4.864 0 0 1 50 54.818Z'
        fill='#fff'
      />
    </AppIcon>
  ),
}
