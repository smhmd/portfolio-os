import { useEffect, useMemo, useRef, useState } from 'react'

import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { type Object3D, Vector2, Vector3 } from 'three'

import { interpolate, PI, TAU } from 'src/lib/math'

type WheelProps = {
  axis: 'x' | 'y' | 'z'
  initialPosition?: number
}

const TURNS = 4
const SNAP = TAU / TURNS
const SNAP_DURATION = 0.15

const angleAt = (e: PointerEvent, center: Vector2) =>
  Math.atan2(e.clientY - center.y, e.clientX - center.x) // atan2(y, x)

/**
 * Turns a 3D handle like a physical wheel: drag to rotate around `axis`, release
 * to snap to the nearest quarter-turn. `turns` reports the settled quarter-turn count.
 */
export function useWheel({ axis, initialPosition = 0 }: WheelProps) {
  const {
    camera,
    gl: { domElement },
  } = useThree()

  const [locked, setLocked] = useState(false)

  const dragging = useRef(false)

  const target = useRef<Object3D>(null!)
  const handle = useRef<Object3D>(null!)
  const position = useRef(initialPosition)

  const prevAngle = useRef(0)
  const center2D = useRef(new Vector2())
  const center3D = useRef(new Vector3())

  // Snap state
  const from = useRef(0)
  const to = useRef(0)
  const t = useRef(1)

  useEffect(() => {
    target.current.rotation[axis] = initialPosition * SNAP
  }, [axis, initialPosition])

  // Animate snapping
  useFrame((_, delta) => {
    if (!target.current) return
    if (t.current >= 1) return

    t.current = Math.min(1, t.current + delta / SNAP_DURATION)
    const rotation = interpolate(
      t.current,
      [0, 1],
      [from.current, to.current],
      'ease-out',
    )

    target.current.rotation[axis] = rotation
  })

  function onMove(e: PointerEvent) {
    if (!target.current) return

    const angle = angleAt(e, center2D.current)
    let delta = angle - prevAngle.current
    delta = ((delta + PI) % TAU) - PI

    target.current.rotation[axis] -= delta
    prevAngle.current = angle
  }

  // Convert object world position to screen
  function worldToScreen(w: Vector3, s: Vector2) {
    w.project(camera)
    const { width, height } = domElement.getBoundingClientRect()
    s.set((w.x * 0.5 + 0.5) * width, (-w.y * 0.5 + 0.5) * height)
  }

  function release() {
    dragging.current = false

    domElement.removeEventListener('pointermove', onMove)

    const current = target.current.rotation[axis]
    const turn = Math.round(current / SNAP)
    position.current = ((turn % TURNS) + TURNS) % TURNS

    from.current = current
    to.current = turn * SNAP
    t.current = 0
  }

  function drag({ nativeEvent: e }: ThreeEvent<PointerEvent>) {
    if (locked) return
    if (!handle.current) return

    t.current = 1 // stop any active snap animations
    dragging.current = true

    handle.current.getWorldPosition(center3D.current)
    worldToScreen(center3D.current, center2D.current)
    prevAngle.current = angleAt(e, center2D.current)

    domElement.addEventListener('pointermove', onMove)
    domElement.addEventListener('pointerup', release, { once: true })
    domElement.addEventListener('pointercancel', release, { once: true })
  }

  function lock(value: boolean) {
    if (locked !== value) setLocked(value)
  }

  return useMemo(
    () => ({ target, handle, position, locked, dragging, drag, lock }),
    [locked],
  )
}
