import { PI } from 'src/lib'

const lights = {
  cool: [0xa7c4e1, 0xdcf7ff, 0x72a4c5],
  warm: [0xcfbc9b, 0xd9dfc6, 0xa9957c],
  pink: [0xf6a0a2, 0xffbed4, 0xc77e84],
} as const

const lighting = lights['pink']

type Position = [number, number, number]

export function Lights() {
  return lighting.map((light, i) => {
    const position: Position = [0, 0, 0]
    position[i] = 10
    return (
      <directionalLight
        key={light}
        color={light}
        intensity={PI / 1.6}
        position={position}
      />
    )
  })
}
