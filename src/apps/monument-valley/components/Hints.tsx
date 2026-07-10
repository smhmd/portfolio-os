import { Html } from '@react-three/drei'
import clsx from 'clsx'

const hints = [
  {
    text: 'Tap the path\nto move Ida ⤵︎',
    position: [-8.6, 2.5, -0.8],
    transform: 'rotateZ(-31deg) rotateY(45deg) rotateX(-45deg)',
  },
  {
    text: 'Hold and rotate ↻',
    position: [-2.407, 8.26, 0.98],
    transform: 'rotateZ(31deg) rotateY(-45deg) rotateX(45deg)',
  },
] as const

type HintsProps = {
  tap?: boolean
  rotate?: boolean
}

export function Hints({ tap = false, rotate = false }: HintsProps) {
  const show = [tap, rotate]

  return hints.map(({ text, position, transform }, i) => (
    <Html
      key={i}
      position={position}
      wrapperClass='z-0!' // important to keep hints under site-wide overlays
      inert={!show[i]}
      className={clsx(
        'pointer-events-none whitespace-pre',
        'transform-3d p-1',
        'text-start font-sans font-medium uppercase',
        'text-base tracking-wider',
        'text-white',
        'transition-opacity duration-500 ease-in',
        'starting:opacity-0',
        show[i] ? 'opacity-100' : 'opacity-0',
        show[0] && 'delay-2000',
      )}
      style={{ transform }}
      distanceFactor={0.02}>
      {text}
    </Html>
  ))
}
