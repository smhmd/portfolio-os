import { useMemo, useRef } from 'react'

import {
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import * as THREE from 'three'

import { DICE_FONT_NAME } from '../lib'

function createGeometry({
  vertices,
  indices,
  padding = 0,
  angleOffset = Math.PI / 2,
  radius = 1,
  verticalOffset = 0,
}: {
  vertices: number[][]
  indices: number[][]
  padding?: number
  verticalOffset?: number
  angleOffset?: number
  radius?: number
}) {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []
  const UVs: number[] = []
  const indexArray: number[] = []
  const groups: THREE.BufferGeometry['groups'] = []

  // Create a vertex cache to avoid duplicates
  const vertexCache: Record<string, number> = {}
  let vertexIndex = 0

  // Helper to normalize and scale vertices
  const normalizeVertex = (v: number[]) => {
    const [x, y, z] = v
    const length = Math.sqrt(x * x + y * y + z * z)
    return length > 0
      ? [(x / length) * radius, (y / length) * radius, (z / length) * radius]
      : [0, 0, 0]
  }

  let indexOffset = 0

  indices.forEach((face) => {
    const vertexCount = face.length - 1 // Last item is material index
    const angleStep = (2 * Math.PI) / vertexCount
    const materialIndex = face[vertexCount]

    const faceIndices: number[] = []

    // Create vertices and UVs for this face
    for (let j = 0; j < vertexCount; j++) {
      const vertexKey = `${face[j]}-${j}`

      if (vertexCache[vertexKey] === undefined) {
        const normalized = normalizeVertex(vertices[face[j]])
        positions.push(...normalized)

        const angle = j * angleStep + angleOffset
        const u = (Math.cos(angle) + 1 + padding) / (2 * (1 + padding))
        const v =
          (Math.sin(angle) + 1 + padding) / (2 * (1 + padding)) + verticalOffset
        UVs.push(u, v)

        vertexCache[vertexKey] = vertexIndex++
      }
      faceIndices.push(vertexCache[vertexKey])
    }

    // Create triangles (fan triangulation)
    for (let j = 1; j < vertexCount - 1; j++) {
      indexArray.push(faceIndices[0], faceIndices[j], faceIndices[j + 1])
    }

    // Add material group
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
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(UVs, 2))
  geometry.setIndex(indexArray)

  // Add material groups
  groups.forEach((group) => {
    geometry.addGroup(group.start, group.count, group.materialIndex)
  })

  // Compute normals
  geometry.computeVertexNormals()
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius)

  return geometry
}

function createD4Geometry() {
  const vertices = [
    [1, 1, 1],
    [-1, -1, 1],
    [-1, 1, -1],
    [1, -1, -1],
  ]
  const indices = [
    [1, 0, 2, 1],
    [0, 1, 3, 2],
    [0, 3, 2, 3],
    [1, 2, 3, 4],
  ]

  return createGeometry({
    vertices,
    indices,
    padding: -0.1,
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
    [0, 3, 2, 1, 1],
    [1, 2, 6, 5, 2],
    [0, 1, 5, 4, 3],
    [3, 7, 6, 2, 4],
    [0, 4, 7, 3, 5],
    [4, 5, 6, 7, 6],
  ]

  return createGeometry({
    vertices,
    indices,
    padding: 0.1,
    angleOffset: -Math.PI / 4,
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
    [0, 2, 4, 1],
    [0, 4, 3, 2],
    [0, 3, 5, 3],
    [0, 5, 2, 4],
    [1, 3, 4, 5],
    [1, 4, 2, 6],
    [1, 2, 5, 7],
    [1, 5, 3, 8],
  ]

  return createGeometry({
    vertices,
    indices,
    angleOffset: Math.PI / 2,
  })
}

function createD10Geometry() {
  const a = (Math.PI * 2) / 10,
    h = 0.105,
    v = -1
  const vertices = []
  for (let i = 0, b = 0; i < 10; ++i, b += a) {
    vertices.push([Math.cos(b), Math.sin(b), h * (i % 2 ? 1 : -1)])
  }
  vertices.push([0, 0, -1])
  vertices.push([0, 0, 1])
  const indices = [
    [5, 7, 11, 0],
    [4, 2, 10, 1],
    [1, 3, 11, 2],
    [0, 8, 10, 3],
    [7, 9, 11, 4],
    [8, 6, 10, 5],
    [9, 1, 11, 6],
    [2, 0, 10, 7],
    [3, 5, 11, 8],
    [6, 4, 10, 9],
    [1, 0, 2, v],
    [1, 2, 3, v],
    [3, 2, 4, v],
    [3, 4, 5, v],
    [5, 4, 6, v],
    [5, 6, 7, v],
    [7, 6, 8, v],
    [7, 8, 9, v],
    [9, 8, 0, v],
    [9, 0, 1, v],
  ]

  return createGeometry({
    vertices,
    indices,
    angleOffset: (Math.PI * 6) / 5,
    verticalOffset: 0.04,
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
    [2, 14, 4, 12, 0, 1],
    [15, 9, 11, 19, 3, 2],
    [16, 10, 17, 7, 6, 3],
    [6, 7, 19, 11, 18, 4],
    [6, 18, 2, 0, 16, 5],
    [18, 11, 9, 14, 2, 6],
    [1, 17, 10, 8, 13, 7],
    [1, 13, 5, 15, 3, 8],
    [13, 8, 12, 4, 5, 9],
    [5, 4, 14, 9, 15, 10],
    [0, 12, 8, 10, 16, 11],
    [3, 19, 7, 17, 1, 12],
  ]

  return createGeometry({
    vertices,
    indices,
    radius: 0.9,
    padding: 0.2,
    angleOffset: Math.PI / 2,
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
    [0, 11, 5, 1],
    [0, 5, 1, 2],
    [0, 1, 7, 3],
    [0, 7, 10, 4],
    [0, 10, 11, 5],
    [1, 5, 9, 6],
    [5, 11, 4, 7],
    [11, 10, 2, 8],
    [10, 7, 6, 9],
    [7, 1, 8, 10],
    [3, 9, 4, 11],
    [3, 4, 2, 12],
    [3, 2, 6, 13],
    [3, 6, 8, 14],
    [3, 8, 9, 15],
    [4, 9, 5, 16],
    [2, 4, 11, 17],
    [6, 2, 10, 18],
    [8, 6, 7, 19],
    [9, 8, 1, 20],
  ]

  return createGeometry({
    vertices,
    indices,
    padding: -0.1,
    angleOffset: -Math.PI / 6,
  })
}

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

function createMaterials(labels: string[] | string[][]) {
  return labels.map(
    (text) =>
      new THREE.MeshPhongMaterial({
        map: createTextTexture(text),
        color: '#ffffff',
        specular: '#171d1f',
        emissive: '#000000',
        shininess: 70,
        transparent: true,
        depthWrite: false,
      }),
  )
}

const genericLabels = [
  '0',
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

const d100Labels = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90']

const d4Labels = [
  [],
  ['2', '4', '3'],
  ['1', '3', '4'],
  ['2', '1', '4'],
  ['1', '2', '3'],
]

const d4Geometry = createD4Geometry()
const d6Geometry = createD6Geometry()
const d8Geometry = createD8Geometry()
const d10Geometry = createD10Geometry()
const d12Geometry = createD12Geometry()
const d20Geometry = createD20Geometry()

function createColorMaterial(color: string) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  })
}

const crimsonMaterial = createColorMaterial('crimson')
const goldMaterial = createColorMaterial('gold')
const darkorangeMaterial = createColorMaterial('darkorange')
const mediumpurpleMaterial = createColorMaterial('mediumpurple')
const royalblueMaterial = createColorMaterial('royalblue')
const mediumseagreenMaterial = createColorMaterial('mediumseagreen')
const tomatoMaterial = createColorMaterial('tomato')

const dice = [
  { position: [0, 0, -3], type: 6 },
  { position: [0, 0, 0], type: 8 },
  { position: [3, 0, 3], type: 4 },
  { position: [0, 0, 3], type: 10 },
  { position: [3, 0, -2], type: 12 },
  { position: [-3, 0, -1], type: 20 },
  { position: [-3, 0, 2], type: 100 },
] as const

export function Dice() {
  const diceTypes = useMemo(() => {
    const genericMaterials = createMaterials(genericLabels)
    const d100Materials = createMaterials(d100Labels)
    const d4Materials = createMaterials(d4Labels)

    const types = {
      4: {
        geometry: d4Geometry,
        labels: d4Materials,
        color: crimsonMaterial,
      },
      6: {
        geometry: d6Geometry,
        labels: genericMaterials,
        color: goldMaterial,
      },
      8: {
        geometry: d8Geometry,
        labels: genericMaterials,
        color: darkorangeMaterial,
      },
      10: {
        geometry: d10Geometry,
        labels: genericMaterials,
        color: mediumpurpleMaterial,
      },
      12: {
        geometry: d12Geometry,
        labels: genericMaterials,
        color: royalblueMaterial,
      },
      20: {
        geometry: d20Geometry,
        labels: genericMaterials,
        color: mediumseagreenMaterial,
      },
      100: {
        geometry: d10Geometry,
        labels: d100Materials,
        color: tomatoMaterial,
      },
    }

    return types
  }, [])

  return dice.map(({ type, position }, i) => {
    const { geometry, labels, color } = diceTypes[type]
    const colliders = type === 6 ? 'cuboid' : 'hull'

    return (
      <Die
        colliders={colliders}
        key={i}
        position={position}
        rotation={[Math.PI * 0.3, Math.PI * 0.4, Math.PI * 1.8]}
        geometry={geometry}
        color={color}
        labels={labels}
      />
    )
  })
}

type DieProps = {
  geometry: THREE.BufferGeometry<THREE.NormalBufferAttributes>
  color: THREE.MeshStandardMaterial
  labels: THREE.MeshPhongMaterial[]
  position: Readonly<[number, number, number]>
} & RigidBodyProps

function getInwardImpulse(
  pos: { x: number; y: number; z: number },
  mass: number,
) {
  return {
    x: (-pos.x + (Math.random() - 0.5)) * mass,
    y: (2 - pos.y + (Math.random() - 0.5)) * mass,
    z: (-pos.z + (Math.random() - 0.5)) * mass,
  }
}

function Die({ geometry, color, labels, position, ...props }: DieProps) {
  const body = useRef<RapierRigidBody>(null)
  const mesh = useRef<THREE.Mesh>(null)

  function handleJump() {
    if (!body.current) return
    const mass = body.current.mass()
    const pos = body.current.translation()
    body.current.applyImpulse(getInwardImpulse(pos, mass), true)

    body.current.applyTorqueImpulse(
      {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5,
        z: Math.random() - 0.5,
      },
      true,
    )
  }

  return (
    <RigidBody ref={body} position={position} {...props}>
      <mesh
        ref={mesh}
        geometry={geometry}
        material={color}
        castShadow
        onClick={handleJump}
      />
      <mesh geometry={geometry} material={labels} />
    </RigidBody>
  )
}
