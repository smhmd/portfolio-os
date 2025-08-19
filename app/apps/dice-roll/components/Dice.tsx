import { use, useMemo, useRef } from 'react'

import { PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import {
  InstancedRigidBodies,
  type InstancedRigidBodiesProps,
  type InstancedRigidBodyProps,
  Physics,
  type RapierRigidBody,
  RigidBody,
  type RigidBodyAutoCollider,
} from '@react-three/rapier'
import * as THREE from 'three'

import { createClientPromise } from 'app/lib'

import { colorLog, DICE_FONT_NAME, getFace } from '../lib'

const zoom = 65

const fontPromise = createClientPromise(
  document.fonts.load(`1pt ${DICE_FONT_NAME}`),
)

export default function Experience() {
  use(fontPromise)

  const { size } = useThree()
  const width = (size.width / zoom) * 2
  const height = (size.height / zoom) * 2

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, 18, 20]}
        fov={zoom}
        near={0.1}
        far={1000}
        onUpdate={(self) => self.lookAt(0, 6, 0)}
      />

      <directionalLight
        position={[5, 7, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-width}
        shadow-camera-right={width}
        shadow-camera-top={height}
        shadow-camera-bottom={-height}
        shadow-camera-near={0.1}
        shadow-camera-far={200}
      />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[0, 10, 0]}
        angle={Math.PI / 4}
        penumbra={1.9}
        decay={0.1}
        intensity={Math.PI}
      />

      <pointLight position={[0, 10, 0]} decay={0} intensity={Math.PI / 2} />

      <fog attach='fog' args={['black', 0, 80]} />
      <Physics gravity={[0, -9.81, 0]}>
        <Dice />

        <RigidBody type='fixed' colliders='cuboid'>
          <mesh
            position={[0, -0.1, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow>
            <boxGeometry args={[width, height, 1]} />
            <meshStandardMaterial color='black' />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}

function createGeometry({
  vertices,
  indices,
  size = 0,
  angleOffset = Math.PI / 2,
  radius = 1,
  verticalOffset = 0,
  normalLength,
}: {
  vertices: number[][]
  indices: number[][]
  size?: number
  verticalOffset?: number
  angleOffset?: number
  radius?: number
  normalLength?: number
}) {
  const geometry = new THREE.BufferGeometry()

  const positions: number[] = []
  const uvs: number[] = []
  const indexArray: number[] = []
  const groups: THREE.BufferGeometry['groups'] = []

  const vertexCache = new Map<string, number>()
  let vertexIndex = 0

  let indexOffset = 0
  const denominator = 2 * (1 + size)

  indices.forEach((face, index) => {
    const vertexCount = face.length // Last item is material index
    const angleStep = (2 * Math.PI) / vertexCount
    const materialIndex = index + 1 // Material ID (+1 because group 0 is reserved)

    const faceIndices: number[] = []

    for (let i = 0; i < vertexCount; i++) {
      const index = face[i]
      const key = `${index}-${i}`

      if (!vertexCache.has(key)) {
        const vertex = new THREE.Vector3(...vertices[index])
        vertex.normalize().multiplyScalar(radius)
        positions.push(vertex.x, vertex.y, vertex.z)

        const angle = i * angleStep + angleOffset
        uvs.push(
          (Math.cos(angle) + 1 + size) / denominator,
          (Math.sin(angle) + 1 + size) / denominator + verticalOffset,
        )

        vertexCache.set(key, vertexIndex++)
      }

      faceIndices.push(vertexCache.get(key)!)
    }

    // Create triangles (fan triangulation)
    for (let j = 1; j < vertexCount - 1; j++) {
      indexArray.push(faceIndices[0], faceIndices[j], faceIndices[j + 1])
    }

    const triangleCount = vertexCount - 2
    groups.push({
      start: indexOffset,
      count: triangleCount * 3,
      materialIndex,
    })

    indexOffset += triangleCount * 3
  })

  // Set geometry attributes
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indexArray)

  geometry.clearGroups()

  // first group covers the whole geometry (reserved for the color)
  geometry.addGroup(0, indexArray.length, 0)

  groups.forEach((group) => {
    geometry.addGroup(group.start, group.count, group.materialIndex)
  })

  // Compute normals
  geometry.computeVertexNormals()
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius)

  const normals = indices.slice(0, normalLength).map(([a, b, c]) => {
    const v0 = new THREE.Vector3(...vertices[a])
    const v1 = new THREE.Vector3(...vertices[b])
    const v2 = new THREE.Vector3(...vertices[c])

    return v1.sub(v0).cross(v2.sub(v0)).normalize()
  })

  return { geometry, normals }
}

function createD4Geometry() {
  const vertices = [
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ]
  const indices = [
    [1, 0, 2],
    [0, 1, 3],
    [0, 3, 2],
    [1, 2, 3],
  ]

  return createGeometry({
    vertices,
    indices,
    size: -0.1,
    angleOffset: (Math.PI * 7) / 6,
  })
}

function createD6Geometry() {
  const vertices = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],
  ]
  const indices = [
    [0, 3, 2, 1],
    [1, 2, 6, 5],
    [0, 1, 5, 4],
    [3, 7, 6, 2],
    [0, 4, 7, 3],
    [4, 5, 6, 7],
  ]

  return createGeometry({
    vertices,
    indices,
    angleOffset: -Math.PI / 4,
    verticalOffset: 0.02,
  })
}

function createD8Geometry() {
  const vertices = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ]
  const indices = [
    [0, 2, 4],
    [0, 4, 3],
    [0, 3, 5],
    [0, 5, 2],
    [1, 3, 4],
    [1, 4, 2],
    [1, 2, 5],
    [1, 5, 3],
  ]

  return createGeometry({
    vertices,
    indices,
  })
}

function createD10Geometry() {
  const a = (Math.PI * 2) / 10
  const h = 0.105
  const vertices = []
  for (let i = 0, b = 0; i < 10; ++i, b += a) {
    vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)])
  }
  vertices.push([0, 0, -1], [0, 0, 1])

  const indices = [
    // big triangles:
    [10, 0, 8],
    [11, 1, 3],
    [10, 2, 0],
    [11, 3, 5],
    [10, 4, 2],
    [11, 5, 7],
    [10, 6, 4],
    [11, 7, 9],
    [10, 8, 6],
    [11, 9, 1],
    // small triangles:
    [1, 0, 2],
    [1, 2, 3],
    [3, 2, 4],
    [3, 4, 5],
    [5, 4, 6],
    [5, 6, 7],
    [7, 6, 8],
    [7, 8, 9],
    [9, 8, 0],
    [9, 0, 1],
  ]

  return createGeometry({
    vertices,
    indices,
    size: -0.1,
    verticalOffset: 0.04,
    normalLength: 10,
  })
}

function createD12Geometry() {
  const p = (1 + Math.sqrt(5)) / 2,
    q = 1 / p
  const vertices = [
    [0, q, p],
    [0, q, -p],
    [0, -q, p],
    [0, -q, -p],
    [p, 0, q],
    [p, 0, -q],
    [-p, 0, q],
    [-p, 0, -q],
    [q, p, 0],
    [q, -p, 0],
    [-q, p, 0],
    [-q, -p, 0],
    [1, 1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],
    [-1, -1, 1],
    [-1, -1, -1],
  ]
  const indices = [
    [2, 14, 4, 12, 0],
    [15, 9, 11, 19, 3],
    [16, 10, 17, 7, 6],
    [6, 7, 19, 11, 18],
    [6, 18, 2, 0, 16],
    [18, 11, 9, 14, 2],
    [1, 17, 10, 8, 13],
    [1, 13, 5, 15, 3],
    [13, 8, 12, 4, 5],
    [5, 4, 14, 9, 15],
    [0, 12, 8, 10, 16],
    [3, 19, 7, 17, 1],
  ]

  return createGeometry({
    vertices,
    indices,
    radius: 0.9,
    size: 0.2,
    verticalOffset: 0.02,
  })
}

function createD20Geometry() {
  const t = (1 + Math.sqrt(5)) / 2
  const vertices = [
    [-1, t, 0],
    [1, t, 0],
    [-1, -t, 0],
    [1, -t, 0],
    [0, -1, t],
    [0, 1, t],
    [0, -1, -t],
    [0, 1, -t],
    [t, 0, -1],
    [t, 0, 1],
    [-t, 0, -1],
    [-t, 0, 1],
  ]
  const indices = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ]

  return createGeometry({
    vertices,
    indices,
    size: -0.1,
    angleOffset: -Math.PI / 6,
  })
}

const d4Geometry = createD4Geometry()
const d6Geometry = createD6Geometry()
const d8Geometry = createD8Geometry()
const d10Geometry = createD10Geometry()
const d12Geometry = createD12Geometry()
const d20Geometry = createD20Geometry()

const labels = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
]

const d10Labels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const d100Labels = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90']
const d4Labels = [
  ['2', '4', '3'],
  ['1', '3', '4'],
  ['2', '1', '4'],
  ['1', '2', '3'],
]

const TEXTURE_SIZE = 256

function createTextTexture(text: string | string[]) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  canvas.width = canvas.height = TEXTURE_SIZE * 2
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.font = `${TEXTURE_SIZE * 0.5}pt "${DICE_FONT_NAME}"`
  context.textAlign = 'center'
  context.textBaseline = 'middle'

  context.fillStyle = 'white'
  context.strokeStyle = 'rgba(0, 0, 0, 0.35)'
  context.lineWidth = 4

  context.translate(0, 0)

  if (typeof text === 'string') {
    context.strokeText(text, TEXTURE_SIZE, TEXTURE_SIZE)
    context.fillText(text, TEXTURE_SIZE, TEXTURE_SIZE)

    if (text === '6' || text === '9') {
      const dotX = TEXTURE_SIZE + TEXTURE_SIZE * 0.1
      context.strokeText('.', dotX, TEXTURE_SIZE)
      context.fillText('.', dotX, TEXTURE_SIZE)
    }
  } else {
    const radius = TEXTURE_SIZE * 0.5
    const start = -Math.PI / 2
    const step = (Math.PI * 2) / 3

    text.forEach((t, i) => {
      const angle = start + i * step
      const x = TEXTURE_SIZE + radius * Math.cos(angle)
      const y = TEXTURE_SIZE + radius * Math.sin(angle)

      context.save()
      context.translate(x, y)
      context.rotate(angle + Math.PI / 2)
      context.strokeText(t, 0, 0)
      context.fillText(t, 0, 0)
      context.restore()
    })
  }

  return new THREE.CanvasTexture(canvas)
}

function createLabelMaterials(
  labels: string[] | string[][],
  color: string = 'white',
) {
  return labels.map(
    (text) =>
      new THREE.MeshPhongMaterial({
        map: createTextTexture(text),
        color,
        transparent: true,
        depthWrite: false,
      }),
  )
}

function createColorMaterial(color: string) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  })
}

function Dice() {
  return dice.map(({ variant, count }, i) => (
    <Die key={i} variant={variant} position={positions[i]} count={count} />
  ))
}

type DieProps = {
  variant: keyof typeof variants
  position: Readonly<[number, number, number]>
  count: number
} & Partial<InstancedRigidBodiesProps>

function Die({ variant, position, count, ...props }: DieProps) {
  const { background, color, geometry, labels, normals } = variants[variant]

  const { colliders, materials, instances } = useMemo(() => {
    const colliders: RigidBodyAutoCollider = variant === 6 ? 'cuboid' : 'hull'
    const materials = [
      createColorMaterial(background),
      ...createLabelMaterials(labels, color),
    ]

    const instances = Array.from<number, InstancedRigidBodyProps>(
      { length: count },
      (_, i) => ({
        key: `d${variant}-${i}`,
        position: [-i * 2.3, i * 2, 0],
        rotation: [Math.PI * 0.5, Math.PI * 0.6, Math.PI * 1.3],
        linearVelocity: [-12, 1, -19],
      }),
    )

    return {
      colliders,
      materials,
      instances,
    }
  }, [])

  const bodies = useRef<RapierRigidBody[]>([])
  const meshes = useRef(null)

  const value = useRef<string>(null)
  const stableFrames = useRef(0)

  useFrame(() => {
    if (!bodies.current.length || value.current) return

    const allStill = bodies.current.every((body) => {
      const linvel = body.linvel()
      const angvel = body.angvel()

      const speed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2)
      const rotation = Math.sqrt(angvel.x ** 2 + angvel.y ** 2 + angvel.z ** 2)

      return speed < 0.05 && rotation < 0.05
    })

    if (allStill) {
      stableFrames.current++
      if (stableFrames.current === 15) {
        bodies.current.forEach((body) => {
          const topFaceIndex = getFace({ body, normals, variant })
          if (topFaceIndex !== -1) {
            const faceLabel = labels[topFaceIndex]
            colorLog(background, `D${variant}: ${faceLabel}`)
            value.current = faceLabel.toString()
          }
        })
      }
    } else {
      stableFrames.current = 0
    }
  })

  return (
    <InstancedRigidBodies
      gravityScale={2.5}
      restitution={0.6}
      friction={0.5}
      linearDamping={0.2}
      angularDamping={0.15}
      ref={bodies}
      instances={instances}
      position={position}
      colliders={colliders}
      {...props}>
      <instancedMesh
        frustumCulled={false}
        ref={meshes}
        args={[geometry, materials, count]}
        castShadow
      />
    </InstancedRigidBodies>
  )
}

const variants = {
  4: {
    ...d4Geometry,
    labels: d4Labels,
    background: 'crimson',
    color: 'white',
  },
  6: {
    ...d6Geometry,
    labels: labels,
    background: 'darkorange',
    color: 'white',
  },
  8: {
    ...d8Geometry,
    labels: labels,
    background: 'teal',
    color: 'white',
  },
  10: {
    ...d10Geometry,
    labels: d10Labels,
    background: 'mediumpurple',
    color: 'white',
  },
  12: {
    ...d12Geometry,
    labels: labels,
    background: 'royalblue',
    color: 'white',
  },
  20: {
    ...d20Geometry,
    labels: labels,
    background: 'seagreen',
    color: 'white',
  },
  100: {
    ...d10Geometry,
    labels: d100Labels,
    background: 'tomato',
    color: 'white',
  },
}

const dice = [
  { count: 1, variant: 8 },
  { count: 2, variant: 4 },
  { count: 1, variant: 100 },
  { count: 2, variant: 12 },
  { count: 2, variant: 6 },
  { count: 1, variant: 20 },
  { count: 1, variant: 10 },
] as const

const positions = [
  [12, 2, 20],
  [12, 2, 20],
  [12 - 3, 2, 20],
  [12 - 3, 2, 20],
  [12, 2, 20],
  [12 + 3, 2, 20],
  [12 + 3, 2, 20],
] as const
