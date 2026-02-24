import { useRef } from 'react'

import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { type Object3D, Vector2, Vector3 } from 'three'

import { HALF_PI, PI, TAU } from 'src/lib'
import { interpolate } from 'src/utils'

type ThreeDialProps = {
  axis?: 'x' | 'y' | 'z'
}

const SNAP = HALF_PI
const SNAP_DURATION = 0.15

const angleAt = (e: PointerEvent, center: Vector2) =>
  Math.atan2(e.clientY - center.y, e.clientX - center.x) // atan2(y, x)

export function useThreeDial({ axis = 'z' }: ThreeDialProps) {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const object = useRef<Object3D>(null!)
  const handle = useRef<Object3D>(null!)

  const prevAngle = useRef(0)
  const center2D = useRef(new Vector2())
  const center3D = useRef(new Vector3())

  // Snap state
  const from = useRef(0)
  const to = useRef(0)
  const t = useRef(1)

  // Animate snapping
  useFrame((_, delta) => {
    if (!object.current) return
    if (t.current >= 1) return

    t.current = Math.min(1, t.current + delta / SNAP_DURATION)
    const rotation = interpolate(
      t.current,
      [0, 1],
      [from.current, to.current],
      'ease-out',
    )

    object.current.rotation[axis] = rotation
  })

  const startSnap = () => {
    if (!object.current) return

    const current = object.current.rotation[axis]
    const target = Math.round(current / SNAP) * SNAP
    from.current = current
    to.current = target
    t.current = 0
  }

  const onMove = (e: PointerEvent) => {
    if (!object.current) return

    const angle = angleAt(e, center2D.current)
    let delta = angle - prevAngle.current
    delta = ((delta + PI) % TAU) - PI

    object.current.rotation[axis] -= delta
    prevAngle.current = angle
  }

  // Convert object world position to screen
  const worldToScreen = (w: Vector3, s: Vector2) => {
    w.project(camera)
    const { width, height } = domElement.getBoundingClientRect()
    s.set((w.x * 0.5 + 0.5) * width, (-w.y * 0.5 + 0.5) * height)
  }

  const drag = ({ nativeEvent: e }: ThreeEvent<PointerEvent>) => {
    if (!handle.current) return
    e.preventDefault()

    handle.current.getWorldPosition(center3D.current)
    worldToScreen(center3D.current, center2D.current)
    prevAngle.current = angleAt(e, center2D.current)

    prevAngle.current = angleAt(e, center2D.current)

    domElement.addEventListener('pointermove', onMove)
    domElement.addEventListener(
      'pointerup',
      () => {
        domElement.removeEventListener('pointermove', onMove)
        startSnap()
      },
      { once: true },
    )
  }

  return { object, handle, drag }
}
