import { useRef } from 'react'

import { type ThreeElements } from '@react-three/fiber'
import type * as THREE from 'three'
import { BoxGeometry, MeshStandardMaterial, PlaneGeometry } from 'three'

import { HALF_PI, PI } from 'src/lib'

import { useThreeDial } from '../lib'

const flatShading = true
const base = new MeshStandardMaterial({ color: 'whitesmoke', flatShading })
const accent = new MeshStandardMaterial({ color: 'silver', flatShading })
const accent2 = new MeshStandardMaterial({ color: 'darkgray', flatShading })
const yellow = new MeshStandardMaterial({
  color: 'yellow',
  flatShading,
})

type Position = [number, number, number]

const playerPosition = 2

const graph = [
  { position: [-1, 0, 0], neighbors: [1] },
  { position: [-2, 0, 0], neighbors: [0, 2] },
  { position: [-3, 0, 0], neighbors: [1, 3] },
  { position: [-4, 0, 0], neighbors: [2, 4] },
  { position: [-5, 0, 0], neighbors: [3, 5] },
  { position: [-6, 0, 0], neighbors: [4, 6] },
  { position: [-7, 0, 0], neighbors: [5, 7] },
  { position: [-7, 0, -1], neighbors: [6, 8] },
  { position: [0, 7, 5], neighbors: [7, 9] },
  { position: [0, 7, 4], neighbors: [8, 10] },
  { position: [0, 7, 3], neighbors: [9, 11] },
  { position: [0, 7, 2], neighbors: [10, 12] },
  { position: [0, 7, 1], neighbors: [11, 13] },
  { position: [0, 7, 0], neighbors: [12, 14] },
  { position: [-1, 7, 0], neighbors: [13, 15] },
  { position: [-2, 7, 0], neighbors: [14, 16] },
  { position: [-3, 7, 0], neighbors: [15, 17] },
  { position: [-4, 7, 0], neighbors: [16, 18] },
  { position: [-5, 7, 0], neighbors: [17, 19] },
  { position: [-6, 7, 0], neighbors: [18, 20] },
  { position: [-7, 7, 0], neighbors: [19, 21] },
  { position: [-7, 7, -1], neighbors: [20, 22] },
  { position: [-7, 7, -2], neighbors: [21, 23] },
  { position: [-7, 7, -3], neighbors: [22, 24] },
  { position: [-7, 7, -4], neighbors: [23, 25] },
  { position: [-7, 7, -5], neighbors: [24] },
] satisfies { position: Position; neighbors: number[] }[]

function findPath(start: number, goal: number): number[] {
  const queue = [[start]]
  const visited = new Set([start])

  while (queue.length) {
    const path = queue.shift()!
    const node = path[path.length - 1]

    if (node === goal) return path

    for (const nb of graph[node].neighbors) {
      if (!visited.has(nb)) {
        visited.add(nb)
        queue.push([...path, nb])
      }
    }
  }

  return []
}

export default function Scene() {
  const playerRef = useRef<THREE.Mesh>(null)
  const playerPosRef = useRef(2)

  function movePlayer(coords: Position) {
    if (!playerRef.current) return

    const [x, y, z] = coords
    playerRef.current.position.x = x
    playerRef.current.position.y = y
    playerRef.current.position.z = z
  }

  async function walkPathTo(target: number) {
    if (!playerPosRef.current) return

    const path = findPath(playerPosRef.current, target)
    if (!path.length) return

    for (const index of path) {
      const coords = graph[index].position

      movePlayer(coords)
      playerPosRef.current = index

      await new Promise((r) => setTimeout(r, 200))
    }
  }

  const { handle, object, drag } = useThreeDial({ axis: 'x' })

  return (
    <group position={[4, -7, 0]}>
      <Player ref={playerRef} position={graph[playerPosition].position} />
      <Box position={[-14, 0, -12]} z={5} />

      <Box position={[0, 1, 0]} y={3} />
      <Box position={[0, 0, 0]} x={7} />

      <Box position={[-7, 0, -3]} z={4} />

      <group position={[0, 7.5, 0.5]} ref={object}>
        <group position={[0, -0.5, -0.5]}>
          <Handle axis='x' ref={handle} onPointerDown={drag} />
          <Box position={[0, 0, 0]} x={4} debug />
          <Box position={[0, -3, 0]} y={3} debug />
        </group>
      </group>
      <Box position={[-11, 0, -7]} x={4} />

      <Pillars y={6} position={[-7, 1, 0]} />

      <Plane position={[0, 7, 4]} axis='y' />
      <Plane position={[0, 7, 4]} axis='x' />

      <Plane position={[-7, 7, 0]} />
      <Plane position={[-6, 7, 0]} />

      {graph.map(({ position }, i) => (
        <Node
          onClick={(e) => {
            e.stopPropagation()
            walkPathTo(i)
          }}
          key={i}
          position={position}
        />
      ))}
    </group>
  )
}

const nodeGeometry = new BoxGeometry(1, 0.01, 1)

function Node({
  position = [0, 0, 0],

  ...props
}: Omit<ThreeElements['mesh'], 'position'> & {
  position?: Position
}) {
  const [x, y, z] = position
  return (
    <mesh
      visible={false}
      position={[x - 0.5, y + 1, z + 0.5]}
      geometry={nodeGeometry}
      material={accent2}
      {...props}
    />
  )
}

function Player(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh position={[-0.5, 1.2, 0.5]} material={yellow}>
        <sphereGeometry args={[0.28, 32, 16]} />
      </mesh>
    </group>
  )
}

type BoxProps = Omit<ThreeElements['mesh'], 'position'> & {
  x?: number
  y?: number
  z?: number
  debug?: boolean
  position?: Position
}

function Box({ position, x = 1, y = 1, z = 1, debug, ...props }: BoxProps) {
  return (
    <group position={position}>
      <mesh
        position={[-x / 2, y / 2, z / 2]}
        material={debug ? accent : base}
        {...props}>
        <boxGeometry args={[x, y, z]} />
      </mesh>
    </group>
  )
}

function Pillars({
  x = 0.1,
  y = 0.1,
  z = 0.1,
  position = [0, 0, 0],
  ...rest
}: BoxProps) {
  const props = { x, y, z, ...rest }
  const [a, b, c] = position
  return (
    <>
      <Box position={[a - 0.9, b, c + 0.9]} {...props} />
      <Box position={[a, b, c + 0.9]} {...props} />
      <Box position={[a, b, c]} {...props} />
    </>
  )
}

const offset = 0.000000000000001

const planes = {
  x: { position: [offset, 0.5, 0.5], rotation: [0, HALF_PI, 0] },
  y: { position: [-0.5, 1 + offset, 0.5], rotation: [-HALF_PI, 0, 0] },
  z: { position: [-0.5, 0.5, 1 + offset], rotation: [0, 0, 0] },
} as const

type PlaneProps = {
  position?: Position
  /** the axis that goes through the center of this plane */
  axis?: 'x' | 'y' | 'z'
  debug?: boolean
}

function Plane({ position = [0, 0, 0], axis = 'z', debug }: PlaneProps) {
  const props = planes[axis]

  return (
    <group position={position}>
      <mesh geometry={planeGeo} material={debug ? accent : base} {...props} />
    </group>
  )
}

const planeGeo = new PlaneGeometry(1, 1)

type HandleProps = {
  axis?: 'x' | 'y' | 'z' | '-x' | '-y' | '-z'
} & ThreeElements['group']

const handles = {
  x: { rotation: undefined },
  y: { rotation: [0, 0, HALF_PI] },
  z: { rotation: [0, -HALF_PI, 0] },
  '-x': { rotation: [0, 0, PI] },
  '-y': { rotation: [0, 0, -HALF_PI] },
  '-z': { rotation: [0, HALF_PI, 0] },
} as const

const BOX_HANDLE = [1, 0.2, 0.2] as const

const CYLINDER_TARGET = [1.3, 1.3, 1, 8] as const
const CYLINDER_MAIN = [0.4, 0.4, 0.5, 48] as const

const CYLINDER_CROSS_ROD = [0.08, 0.08, 2, 24] as const
const CYLINDER_CROSS_CAP = [0.14, 0.14, 0.3, 24] as const

const X_OFFSET = 0.8
const CAP_OFFSET = 1

function Handle({ axis = 'x', ref, ...props }: HandleProps) {
  const { rotation } = handles[axis]

  return (
    <group {...props}>
      <group position={[-0.5, 0.5, 0.5]} rotation={rotation}>
        <group position={[1, 0, 0]}>
          <mesh
            ref={ref}
            visible={false}
            position={[X_OFFSET, 0, 0]}
            rotation={[0, 0, HALF_PI]}>
            <cylinderGeometry args={CYLINDER_TARGET} />
          </mesh>

          <mesh material={accent2}>
            <boxGeometry args={BOX_HANDLE} />
          </mesh>

          <mesh
            material={accent}
            position={[X_OFFSET, 0, 0]}
            rotation={[0, 0, HALF_PI]}>
            <cylinderGeometry args={CYLINDER_MAIN} />
          </mesh>

          {[0, HALF_PI].map((rx) => (
            <group key={rx} rotation={[rx, 0, 0]}>
              <mesh material={accent2} position={[X_OFFSET, 0, 0]}>
                <cylinderGeometry args={CYLINDER_CROSS_ROD} />
              </mesh>

              {[CAP_OFFSET, -CAP_OFFSET].map((y) => (
                <mesh key={y} material={base} position={[X_OFFSET, y, 0]}>
                  <cylinderGeometry args={CYLINDER_CROSS_CAP} />
                </mesh>
              ))}
            </group>
          ))}
        </group>
      </group>
    </group>
  )
}
