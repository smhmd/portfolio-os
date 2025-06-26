import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'

import { useAsync } from '~/hooks'

import { DICE_FONT_NAME } from '../lib'
import { Dice } from './Dice'

export default function Experience() {
  const { isLoading, error } = useAsync(async () => {
    return document.fonts.load(`1pt ${DICE_FONT_NAME}`)
  })

  const isFontLoaded = !(isLoading || error)

  return (
    <>
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1} />
      <directionalLight position={[5, 5, -5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.2} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      <hemisphereLight intensity={0.4} />

      <OrthographicCamera
        makeDefault
        position={[0, 20, 0]}
        zoom={100}
        near={0.1}
        far={1000}
      />

      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={1} />
      <directionalLight position={[5, 5, -5]} intensity={1} />
      <directionalLight position={[-5, -5, 5]} intensity={0.2} />
      <directionalLight position={[0, 5, 5]} intensity={1} />
      <hemisphereLight intensity={0.4} />

      <Physics gravity={[0, -9.81, 0]}>
        {isFontLoaded ? <Dice /> : null}

        <RigidBody type='fixed'>
          <mesh
            position={[0, -1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow>
            <boxGeometry args={[10, 10, 0.2]} />
            <meshStandardMaterial transparent color='#333333' />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls />
    </>
  )
}
