import { useLayoutEffect } from 'react'

import { useSpriteLoader } from '@react-three/drei'
import { type ThreeElements } from '@react-three/fiber'

import { useInstrument } from '../lib'
import { SpriteAnimator } from './SpriteAnimator'

type MascotProps = ThreeElements['mesh'] & { radius: number; onRender(): void }

export default function Mascot({ radius, onRender, ...props }: MascotProps) {
  const { mascotRef, animation } = useInstrument()

  const { spriteObj } = useSpriteLoader(
    '/kalimba/sprite.png',
    '/kalimba/sprite.json',
  )

  useLayoutEffect(() => {
    setTimeout(onRender, 50)
  }, [])

  if (!spriteObj) return null

  return (
    <SpriteAnimator
      animation={animation}
      fps={12}
      radius={radius}
      sprite={spriteObj}
      {...props}
      ref={mascotRef}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial color='black' />
    </SpriteAnimator>
  )
}
