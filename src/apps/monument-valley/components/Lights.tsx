import { PI } from 'src/lib/math'

// x, y, z
const lights = [0x72a4c5, 0xdcf7ff, 0xa7c4e1] as const
// const lights = [0xa9957c, 0xd9dfc6, 0xcfbc9b] as const
// const lights = [0xa387d6, 0xe6d9ec, 0xcaaea5] as const

export function Lights() {
  return lights.map((light, i) => {
    const position = [0, 0, 0] as [number, number, number]
    position[i] = 10

    return (
      <directionalLight
        ref={(l) => l && l.layers.enableAll()}
        key={i}
        color={light}
        intensity={PI / 1.35}
        position={position}
      />
    )
  })
}
