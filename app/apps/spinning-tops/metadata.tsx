import { AppIconWrapper } from 'app/components'
import type { AppMetadata } from 'app/lib'

export const metadata: AppMetadata = {
  id: 'spinning-tops',
  name: 'Spinning Tops',
  description: 'Spin your top and be the last one standing in the arena',
  Icon: AppIcon,
}

export function AppIcon(props: React.ComponentProps<typeof AppIconWrapper>) {
  return (
    <AppIconWrapper fill='white' {...props}>
      <path
        fill='black'
        d='M29.38 40.604c-3.968-5.048-5.073-7.343-5.38-8.269a3.24 3.24 0 0 1 3.606-.928L54.86 41.42a6.265 6.265 0 0 1 3.72 3.72L68.59 72.394A3.24 3.24 0 0 1 67.663 76c-.92-.305-3.22-1.412-8.268-5.38-4.768-3.748-10.379-8.797-15.797-14.215-5.419-5.419-10.47-11.033-14.218-15.8Zm12.327 17.69c-5.859-5.86-11.412-12.084-15.234-17.077a81.82 81.82 0 0 1-1.567-2.111l5.662 12.981a19.442 19.442 0 0 1 .543 14.157l-1.41 4.055 4.055-1.41a19.44 19.44 0 0 1 14.156.543l12.981 5.662a81.823 81.823 0 0 1-2.11-1.567c-4.992-3.825-11.217-9.379-17.076-15.238v.005Zm33.276-33.276a3.476 3.476 0 0 0-4.915 0l-4.547 4.545 4.91 4.912 4.553-4.553a3.476 3.476 0 0 0 0-4.911l-.001.006ZM59.847 41.928l7.132-7.132-1.78-1.774-7.133 7.126a8.743 8.743 0 0 1 1.78 1.78Z'
      />
    </AppIconWrapper>
  )
}
