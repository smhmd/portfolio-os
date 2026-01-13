import { useMemo, useRef } from 'react'

import { Decal, type FrameData, type SpriteData } from '@react-three/drei'
import { type ThreeElements, useFrame } from '@react-three/fiber'
import type * as THREE from 'three'

type SpriteAnimatorProps = {
  sprite: {
    spriteTexture: THREE.Texture
    spriteData: (SpriteData & { animations?: Record<string, number[]> }) | null
  }
  animation?: string
  fps?: number
  radius: number
} & ThreeElements['mesh']

export function SpriteAnimator(props: SpriteAnimatorProps) {
  const {
    ref,
    sprite: { spriteTexture, spriteData },
    animation,
    fps = 30,
    radius,
    children,
    ...rest
  } = props

  if (!spriteData) return null

  const { frames, animations, meta } = spriteData
  const size = meta.size

  const timeRef = useRef(0)
  const indexRef = useRef(0)

  const interval = 1000 / fps

  // normalize frames to array
  const framesArray = useMemo(() => {
    if (Array.isArray(frames)) return frames

    return Object.values(frames).flat()
  }, [frames])

  // filter frames if animation is specified
  const animFrames = useMemo(() => {
    if (animation && animations?.[animation]) {
      return animations[animation].map((i) => framesArray[i])
    }

    return framesArray
  }, [animation, animations, framesArray])

  const updateMap = (f: FrameData['frame']) => {
    spriteTexture.repeat.set(f.w / size.w, f.h / size.h)
    spriteTexture.offset.set(f.x / size.w, 1 - (f.y + f.h) / size.h)
    spriteTexture.needsUpdate = true
  }

  // initial frame
  updateMap(animFrames[0].frame)

  useFrame((_, delta) => {
    timeRef.current += delta * 1000
    if (timeRef.current >= interval) {
      timeRef.current = 0
      indexRef.current = (indexRef.current + 1) % animFrames.length
      updateMap(animFrames[indexRef.current].frame)
    }
  })

  return (
    <mesh ref={ref} {...rest}>
      {children}
      <Decal
        position={[0, 0, radius]}
        rotation={[0, 0, 0]}
        scale={radius * 2.1}
        map={spriteTexture}
      />
    </mesh>
  )
}
