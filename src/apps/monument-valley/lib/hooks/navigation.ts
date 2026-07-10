import { useRef, useState } from 'react'

import { useFrame } from '@react-three/fiber'
import type { Object3D } from 'three'

import {
  GRAPH,
  type IdaAnimation,
  START_NODE,
  STEP_TIME,
  TURN_RATE,
} from '../common'

type CanNavigate = (from: number, to: number) => boolean

/**
 * Breadth-first search for the shortest node sequence from `start` to `goal`
 * along edges that pass `canNavigate`, excluding `start` itself.
 * Returns [] when `goal` is currently unreachable.
 */
function findPath(start: number, goal: number, canNavigate: CanNavigate) {
  const cameFrom = new Map<number, number>([[start, -1]])
  const queue = [start]

  for (let head = 0; head < queue.length; head++) {
    const node = queue[head]
    if (node === goal) break
    for (const edge of GRAPH[node].next) {
      const next = typeof edge === 'number' ? edge : edge.to
      if (!cameFrom.has(next) && canNavigate(node, next)) {
        cameFrom.set(next, node)
        queue.push(next)
      }
    }
  }

  if (!cameFrom.has(goal)) return []

  const path: number[] = []
  for (let node = goal; node !== start; node = cameFrom.get(node)!) {
    path.unshift(node)
  }
  return path
}

type NavigationProps = {
  /** Event handler on called on each node we navigate to. Used to check win conditions and set state. */
  onNavigate?(from: number, to?: number): void
  /**
   * Whether the edge from → to is currently traversable. Called with adjacent
   * nodes only, during pathfinding and again on arrival at each node.
   */
  canNavigate?: CanNavigate
}

export function useNavigation({
  onNavigate,
  canNavigate = () => true,
}: NavigationProps) {
  const ref = useRef<Object3D>(null!)
  const [animation, setAnimation] = useState<IdaAnimation>('idle')

  /** The node sequence being walked */
  const route = useRef([START_NODE])
  /**
   * Integer part is the current edge
   * Fraction is how far along that edge we are
   */
  const progress = useRef(0)
  /**
   * The node we're currently walking towards,
   * so each edge gets validated exactly once on arrival.
   */
  const headedTo = useRef(START_NODE)

  useFrame((_, dt) => {
    const segments = route.current.length - 1
    if (progress.current >= segments) return

    progress.current = Math.min(segments, progress.current + dt / STEP_TIME)

    const seg = Math.min(Math.floor(progress.current), segments - 1)
    const frac = progress.current - seg
    const from = GRAPH[route.current[seg]].pos
    const to = GRAPH[route.current[seg + 1]].pos

    ref.current.position.set(
      from[0] + (to[0] - from[0]) * frac,
      from[1] + (to[1] - from[1]) * frac,
      from[2] + (to[2] - from[2]) * frac,
    )

    // Turn toward the direction of travel, taking the short way round.
    const heading = Math.atan2(to[0] - from[0], to[2] - from[2])
    const delta = heading - ref.current.rotation.y
    ref.current.rotation.y +=
      Math.atan2(Math.sin(delta), Math.cos(delta)) * Math.min(1, TURN_RATE * dt)

    // Arriving at a node: re-check the next edge before committing to it.
    const next = route.current[seg + 1]
    if (next !== headedTo.current) {
      const current = route.current[seg]
      if (!canNavigate(current, next)) {
        route.current = [current]
        progress.current = 0

        setAnimation('idle')
        return
      }
      headedTo.current = next
      onNavigate?.(current, next)
    }

    if (progress.current >= segments) {
      onNavigate?.(route.current[segments], undefined)
      setAnimation('idle')
    }
  })

  function navigate(destination: number): boolean {
    const seg = Math.floor(progress.current)
    const current = route.current[seg]
    const frac = progress.current - seg

    if (destination === current) return false

    const path = findPath(current, destination, canNavigate)
    if (!path.length) return false

    // Standing still, or already heading toward the path's first node:
    // extend forward. Otherwise we're mid-edge facing the wrong way, so
    // reverse back along the current edge before continuing.
    if (frac === 0 || path[0] === route.current[seg + 1]) {
      route.current = [current, ...path]
      progress.current = frac
    } else {
      route.current = [route.current[seg + 1], current, ...path]
      progress.current = 1 - frac
    }

    headedTo.current = route.current[1]
    onNavigate?.(current, route.current[1])
    setAnimation('walk')
    return true
  }

  return { ref, animation, navigate }
}
