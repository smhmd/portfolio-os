import { useLayoutEffect } from 'react'

import { useSpriteLoader } from '@react-three/drei'
import { type ThreeElements } from '@react-three/fiber'

import { DISTANCE, PADDING, useInstrument } from '../lib'
import { SpriteAnimator } from './SpriteAnimator'

type MascotProps = ThreeElements['mesh'] & { radius: number; onRender(): void }

export default function Mascot({ radius, onRender, ...props }: MascotProps) {
  const { mascotRef, animation } = useInstrument()

  const { spriteObj } = useSpriteLoader(
    '/kalimba/sprite.png',
    '/kalimba/sprite.json',
  )

  useLayoutEffect(() => {
    setTimeout(onRender, 1)
  }, [])

  if (!spriteObj) return null

  return (
    <SpriteAnimator
      animation={animation}
      fps={12}
      radius={radius}
      spriteDataset={spriteObj}
      position={[0, 0, -PADDING * DISTANCE]}
      {...props}
      ref={mascotRef}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color='black' />
    </SpriteAnimator>
  )
}
