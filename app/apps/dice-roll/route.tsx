import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { DICE_FONT_NAME } from './lib'
import { AppIcon, metadata } from './metadata'
export function meta() {
  return [
    { title: metadata.name },
    { name: 'description', content: metadata.description },
  ]
}

export function links() {
  const favicon = iconToFavicon(
    <AppIcon fill='transparent' padding={14} wip={false} />,
  )
  return [
    favicon,
    {
      rel: 'stylesheet',
      href: `https://fonts.googleapis.com/css2?family=${DICE_FONT_NAME}:wght@700&text=0123456789&display=swap`,
    },
  ]
}

const Dice = lazy(() => import('./components/Dice'))

export default function App() {
  return (
    <AppWrapper className='relative h-screen w-full'>
      <Canvas shadows className='h-full w-full bg-black'>
        <Suspense fallback={null}>
          <Dice />
        </Suspense>
      </Canvas>
    </AppWrapper>
  )
}
