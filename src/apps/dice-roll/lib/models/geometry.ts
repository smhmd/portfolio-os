import { BufferGeometry, Float32BufferAttribute, Vector3 } from 'three'

import { HALF_PI, TAU } from 'src/lib'

/** Configuration object used to build the geometry */
type Options = {
  /** List of [x, y, z] for each point in the geometry */
  vertices: number[][]
  /** List of vertices indexes to form faces
   * (often triangles but don't have to be.
   * We have a triangulation step in the code for that) */
  faces: number[][]
  /** UV map scalar */
  uvScale?: number
  /** UV map v (vertical) offset */
  vOffset?: number
  /** UV map rotation offset (in radians) */
  angleOffset?: number
  /** Size of the geometry (works as a radius) */
  size?: number
  /** We need normals to determine the value of the dice.
   * But some faces shouldn't be included in this.
   * We use this to limit the faces to include */
  normalLimit?: number
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
  normalLimit: normalLimit,
}: Options) {
  const geometry = new BufferGeometry()

  /** flat array for vertex positions.
   * ex: [x0, y0, z0, x1, y1, z1, ...] */
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  /** Our materials are: color/texture + numbers for each face.
   * Groups allow multiple materials on the same geometry */
  const groups: BufferGeometry['groups'] = []
  let groupCursor = 0

  /** Generate per-face UVs without duplication  */
  const verticesCache = new Map<string, number>()
  let cacheCursor = 0

  faces.forEach((face, faceIndex) => {
    const polygonSidesCount = face.length
    const angleStep = TAU / polygonSidesCount

    /** Material index is offset by +1.
     * Because group 0 is reserved for base color */
    const materialIndex = faceIndex + 1

    /** Stores the final vertex indices for this face */
    const verts: number[] = []

    for (let i = 0; i < polygonSidesCount; i++) {
      const index = face[i]
      const key = `${index}-${i}`

      // Create a new vertex only if this (vertex, face-position) pair
      // Hasn’t been seen before
      if (!verticesCache.has(key)) {
        // Vertex to vector3
        const vertex = new Vector3(...vertices[index])

        // Project the vertex onto a sphere of given radius/size
        vertex.normalize().multiplyScalar(size)

        // Store position data
        positions.push(vertex.x, vertex.y, vertex.z)

        // Generate UVs in a polar (circular) coordinates
        const angle = i * angleStep + angleOffset
        uvs.push(
          0.5 + Math.cos(angle) * uvScale,
          0.5 + Math.sin(angle) * uvScale + vOffset,
        )

        // Cache the index of this newly created vertex
        verticesCache.set(key, cacheCursor++)
      }

      verts.push(verticesCache.get(key)!)
    }

    // Create triangles (fan triangulation)
    // (0, 1, 2), (0, 2, 3), ...
    for (let j = 1; j < polygonSidesCount - 1; j++) {
      indices.push(verts[0], verts[j], verts[j + 1])
    }

    // How many triangles we should make from the polygon face we have
    // If the polygon is a triangle, then it is just 1 triangle :)
    // If the polygon is a square, then it's 2 triangles. Get it?
    const triangleCount = polygonSidesCount - 2

    // Register a group so this face can have its own material
    groups.push({
      start: groupCursor,
      count: triangleCount * 3,
      materialIndex,
    })

    groupCursor += triangleCount * 3
  })

  // Set geometry attributes
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)

  // Reset any existing groups
  geometry.clearGroups()
  // First group covers the whole geometry (reserved for the color)
  geometry.addGroup(0, indices.length, 0)
  // Add per-face material groups
  groups.forEach((group) => {
    geometry.addGroup(group.start, group.count, group.materialIndex)
  })

  /**
   * Create face normals (not vertex normals) -- limited to accommodate d10/d100
   *
   * This is used to determine the top face of each die (see utils' getFace)
   */
  const normals = faces.slice(0, normalLimit).map(([a, b, c]) => {
    const v0 = new Vector3(...vertices[a])
    const v1 = new Vector3(...vertices[b])
    const v2 = new Vector3(...vertices[c])

    return v1.sub(v0).cross(v2.sub(v0)).normalize()
  })

  return { geometry, normals }
}
