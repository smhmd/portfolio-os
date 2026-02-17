import { lazy, Suspense } from 'react'

import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, type Camera } from 'three'

import { AppWrapper } from 'app/components'
import { iconToFavicon } from 'app/utils'

import { DiceProvider, useDice } from './contexts'
import { BACKGROUNDS, DICE_FONT_NAME, type Variant, ZOOM } from './lib'
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
      href: `https://fonts.googleapis.com/css2?family=${DICE_FONT_NAME}:wght@700&display=swap&text=D0123456789.`,
    },
  ]
}

const Scene = lazy(() => import('./components/Scene'))

export default function App() {
  return (
    <AppWrapper className='relative h-screen w-full'>
      <DiceProvider>
        <Canvas
          camera={{
            fov: ZOOM,
            position: [0, ZOOM, 0],
            near: 0.1,
            far: 1000,
            onUpdate(self: Camera) {
              self.lookAt(0, 6, 0)
            },
          }}
          gl={{
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          shadows
          className='h-full w-full'>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
        <UI />
      </DiceProvider>
    </AppWrapper>
  )
}

function UI() {
  const { addDice } = useDice()

  return (
    <section className='font-unifraktur fixed inset-x-0 bottom-0 flex items-center justify-center gap-x-4 pb-8'>
      <div className='flex flex-wrap justify-center divide-x divide-black'>
        {Object.entries(BACKGROUNDS).map(([d, c]) => (
          <button
            onClick={() => {
              addDice(Number(d) as Variant)
            }}
            className='text-shadow-lg relative cursor-pointer bg-cover bg-center bg-no-repeat p-4 text-center bg-blend-overlay'
            key={d}
            style={{
              background: `url('/textures/Ice_1K.jpg'), color-mix(in srgb, ${c} 90%, #222)`,
            }}>
            D{d}
          </button>
        ))}
      </div>
    </section>
  )
}
