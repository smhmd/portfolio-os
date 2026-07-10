import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three'

import { HALF_PI } from 'src/lib/math'

type Options = {
  /** List of [x, y, z] for each point in the geometry. */
  vertices: number[][]
  /** Lists of vertex indices forming faces. Faces can be any polygon. They will be fan-triangulated. */
  faces: number[][]
  /** UV map scalar. */
  uvScale?: number
  /** UV vertical offset. */
  vOffset?: number
  /** UV map rotation offset (in radians) */
  angleOffset?: number
  /** Size of the dice. */
  size?: number
}

/**
 * Create geometry from polygon faces and
 * generate UVs per-face to give each face a material.
 *
 * Calculate face normals (different from vertex normals)
 * to be used for top-face detection of the dice.
 *
 * Return both geometry and face normals
 */
export function createGeometry({
  vertices,
  faces,
  size = 1,
  uvScale = 0.5,
  vOffset = 0,
  angleOffset = HALF_PI,
}: Options) {
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []
  const normals: Vector3[] = []

  const geometry = new BufferGeometry()
  const spin = angleOffset - HALF_PI

  faces.forEach((face, faceIndex) => {
    // Each face emits its OWN vertices (no sharing): planar UVs are per-plane,
    // and flatShading wants hard edges. Project them onto the sphere of `size`.
    const points = face.map((i) =>
      new Vector3(...vertices[i]).normalize().multiplyScalar(size),
    )

    const center = new Vector3()
    const normal = new Vector3()

    // Newell's Algorithm:
    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      const b = points[(i + 1) % points.length]
      center.add(a)
      normal.x += (a.y - b.y) * (a.z + b.z)
      normal.y += (a.z - b.z) * (a.x + b.x)
      normal.z += (a.x - b.x) * (a.y + b.y)
    }
    center.divideScalar(points.length)
    normal.normalize()

    // Point outward (die is convex and centered on the origin).
    if (normal.dot(center) < 0) normal.negate()
    normals.push(normal)

    // In-plane axes: "up" points from center toward the first vertex.
    const up = points[0].clone().sub(center)
    up.addScaledVector(normal, -up.dot(normal)).normalize()
    if (spin !== 0) up.applyAxisAngle(normal, spin)
    const right = up.clone().cross(normal)

    // Project points onto the face plane and normalize to the face radius.
    let maxRadius = 0
    const planar = points.map((p) => {
      const d = p.clone().sub(center)
      const u = d.dot(right)
      const v = d.dot(up)
      maxRadius = Math.max(maxRadius, Math.hypot(u, v))
      return { u, v }
    })
    const scale = uvScale / maxRadius

    // How many vertices exist so far.
    const base = positions.length / 3

    // Emit vertices + UVs
    points.forEach((p, i) => {
      positions.push(p.x, p.y, p.z)
      uvs.push(0.5 + planar[i].u * scale, 0.5 + planar[i].v * scale + vOffset)
    })

    // Fan-triangulate: (0,1,2), (0,2,3), ...
    // Material is faceIndex + 1 because material 0 is the base color.
    const start = indices.length
    for (let j = 1; j <= points.length - 2; j++) {
      indices.push(base, base + j, base + j + 1)
    }
    geometry.addGroup(start, indices.length - start, faceIndex + 1)
  })

  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  // Group 0 is the color (applies to all faces).
  // Groups render in insertion order, so prepend it.
  geometry.groups.unshift({ start: 0, count: indices.length, materialIndex: 0 })

  return { geometry, normals }
}
