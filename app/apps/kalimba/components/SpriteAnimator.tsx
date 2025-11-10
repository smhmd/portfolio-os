import { forwardRef, useMemo, useRef } from 'react'

import {
  Decal,
  type FrameData,
  type MetaData,
  type SpriteData,
} from '@react-three/drei'
import { type ThreeElements, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SphereSpriteAnimatorProps = {
  spriteDataset: {
    spriteTexture: THREE.Texture
    spriteData: (SpriteData & { animations?: Record<string, number[]> }) | null
  }
  animation?: string
  fps?: number
  radius: number
} & ThreeElements['mesh']

export const SpriteAnimator = forwardRef<THREE.Mesh, SphereSpriteAnimatorProps>(
  (
    {
      spriteDataset: { spriteData, spriteTexture },
      animation = '',
      fps = 30,
      radius,
      children,
      ...props
    },
    ref,
  ) => {
    const currentFrame = useRef({ index: 0, time: 0 })
    const fpsInterval = 1000 / fps

    function updateMap({
      frame,
      size,
      texture,
    }: {
      frame: FrameData['frame']
      size: MetaData['size']
      texture: THREE.Texture
    }) {
      const { x, y, w, h } = frame
      const map = texture
      map.repeat.set(w / size.w, h / size.h)
      map.offset.set(x / size.w, 1 - (y + h) / size.h)
      map.needsUpdate = true
    }

    const { frames, size } = useMemo(() => {
      if (!spriteData || !Array.isArray(spriteData.frames)) {
        return { frames: [], size: { w: 1, h: 1 } }
      }

      let { frames } = spriteData
      const { animations } = spriteData

      if (animations && animation && animations[animation]) {
        frames = frames.filter((_, i) => animations[animation].includes(i))
      }

      const { size } = spriteData.meta

      if (frames.length && spriteTexture) {
        updateMap({
          frame: frames[0].frame,
          size,
          texture: spriteTexture,
        })
      }

      return { frames, size }
    }, [spriteData, spriteTexture, animation])

    useFrame((_, delta) => {
      if (!frames.length) return

      currentFrame.current.time += delta * 1000

      if (currentFrame.current.time >= fpsInterval) {
        currentFrame.current.index =
          (currentFrame.current.index + 1) % frames.length
        currentFrame.current.time = 0

        const frame = frames?.[currentFrame.current.index].frame
        if (!frame) return

        updateMap({
          frame,
          size,
          texture: spriteTexture,
        })
      }
    })

    return (
      <mesh ref={ref} {...props}>
        {children}
        <Decal
          position={[0, 0, radius]}
          rotation={[0, 0, 0]}
          scale={radius * 1.8}
          map={spriteTexture}
        />
      </mesh>
    )
  },
)

SpriteAnimator.displayName = 'SpriteAnimator'
