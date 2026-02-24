import { useEffect } from 'react'

import { useTexture } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { RepeatWrapping, SRGBColorSpace } from 'three'

import { HALF_PI } from 'src/lib'

import { DEPTH } from '../lib'

const DISPLACEMENT = 0.051
const TEXTURE_PATH = '/textures/Wood028_1K-JPG/Wood028_1K-JPG_'

export function Floor() {
  const {
    viewport: { width, height },
    camera,
  } = useThree()

  const textures = useTexture({
    map: `${TEXTURE_PATH}Color.jpg`,
    roughnessMap: `${TEXTURE_PATH}Roughness.jpg`,
    normalMap: `${TEXTURE_PATH}NormalGL.jpg`,
    displacementMap: `${TEXTURE_PATH}Displacement.jpg`,
  })

  useEffect(() => {
    if (!textures.map) return
    if ('aspect' in camera) {
      const { image } = textures.map
      const imageAspect = image.width / image.height
      const planeAspect = width / height

      type Transform = [number, number, number, number, number, number, number]

      const transform: Transform =
        planeAspect < imageAspect
          ? [0, 0, planeAspect / imageAspect, 1, 0, 0.5, 0.5]
          : [0, 0, 1, imageAspect / planeAspect, 0, 0.5, 0.5]

      for (const tex of Object.values(textures)) {
        tex.matrixAutoUpdate = false
        tex.wrapS = tex.wrapT = RepeatWrapping
        tex.center.set(0.5, 0.5)
        tex.matrix.setUvTransform(...transform)
      }

      textures.map.colorSpace = SRGBColorSpace
    }
  }, [textures, width, height])

  return (
    <mesh
      position={[0, DEPTH - DISPLACEMENT, 0]}
      rotation={[-HALF_PI, 0, 0]}
      receiveShadow>
      <planeGeometry args={[width, height, 32, 32]} />
      <meshStandardMaterial
        color='#555555'
        {...textures}
        roughness={0.8}
        metalness={2}
        normalScale={1}
        displacementScale={DISPLACEMENT}
      />
    </mesh>
  )
}
