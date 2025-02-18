import { AppIcon, AppWrapper } from 'app/components'
import type { AppMetadata } from 'app/types'
import { iconToFavicon } from 'app/utils'

export function meta() {
  return [{ title: metadata.name }, { name: 'description', content: 'Radio' }]
}

export function links() {
  const favicon = iconToFavicon(<metadata.Icon />)
  return [favicon]
}

export const metadata: AppMetadata = {
  id: 'radio',
  name: 'Radio',
  Icon: (props) => (
    <AppIcon fill='#9A80FF' {...props}>
      <path
        d='M43.455 32.182H27.273V30a4.546 4.546 0 0 1 4.545-4.546h7.273A4.545 4.545 0 0 1 43.636 30l-.181 2.182Z'
        fill='#6348CA'
      />
      <path
        d='M71.818 73.636H28.182A7.637 7.637 0 0 1 20.545 66V38.727a7.637 7.637 0 0 1 7.637-7.636h43.636a7.637 7.637 0 0 1 7.636 7.636V66a7.636 7.636 0 0 1-7.636 7.636Z'
        fill='#fff'
      />
      <path
        d='M37.273 62.182c5.422 0 9.818-4.396 9.818-9.818 0-5.423-4.396-9.819-9.819-9.819-5.422 0-9.818 4.396-9.818 9.819 0 5.422 4.396 9.818 9.819 9.818ZM67.727 50H57.91a2.728 2.728 0 0 1-2.727-2.727 2.728 2.728 0 0 1 2.727-2.728h9.818a2.727 2.727 0 0 1 2.727 2.728A2.728 2.728 0 0 1 67.727 50ZM67.727 60H57.91a2.728 2.728 0 0 1-2.727-2.727 2.728 2.728 0 0 1 2.727-2.728h9.818a2.727 2.727 0 0 1 2.727 2.728A2.728 2.728 0 0 1 67.727 60Z'
        fill='#6348CA'
      />
    </AppIcon>
  ),
}

export default function Radio() {
  return <AppWrapper className=''>Radio</AppWrapper>
}
