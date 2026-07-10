import { useLayoutEffect, useRef } from 'react'

import { type ThreeElements, useFrame, useThree } from '@react-three/fiber'
import {
  Box3,
  type Group,
  MathUtils,
  type OrthographicCamera,
  Vector3,
} from 'three'

type BoundsProps = { mx?: number; my?: number } & ThreeElements['group']

const box = new Box3()
const size = new Vector3()

/**
 * Automatically adjusts camera's zoom so that all child
 * objects remain visible within the viewport.
 *
 * @param props.mx horizontal space
 * @param props.my vertical space
 */
export function Bounds({ mx = 1, my = 1, ...props }: BoundsProps) {
  const ref = useRef<Group>(null!)

  const zoom = useRef(1)

  const camera = useThree((s) => s.camera) as OrthographicCamera
  const viewport = useThree((s) => s.size)

  useLayoutEffect(() => {
    // Ensure world transforms are up to date before measuring.
    ref.current.updateWorldMatrix(true, true)
    box.setFromObject(ref.current)

    if (box.isEmpty()) return // no-op if no objects within
    box.getSize(size)

    // Use mx and my as scale factors
    zoom.current = Math.min(
      (my * (camera.top - camera.bottom)) / size.y,
      (mx * (camera.right - camera.left)) / size.x,
    )

    // Adjust camera depth to fit the measured content
    camera.near = 0.1
    camera.far = Math.max(1000, size.z * 100)
    camera.updateProjectionMatrix()
  }, [camera, viewport])

  useFrame((_, delta) => {
    // Skip updates once the camera is close enough to the desired zoom.
    if (Math.abs(camera.zoom - zoom.current) < 1e-3) return

    // Apply zoom to camera, smoothly
    camera.zoom = MathUtils.damp(camera.zoom, zoom.current, 3, delta)
    camera.updateProjectionMatrix()
  })

  return <group ref={ref} {...props} />
}
