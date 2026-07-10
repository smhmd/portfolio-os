import { useState } from 'react'

import { PlaneGeometry } from 'three'

import { HALF_PI } from 'src/lib/math'

import {
  BRANCH_B,
  BRIDGE,
  EXIT,
  FORK,
  GAP_END,
  GAP_START,
  GRAPH,
  HINT_ROTATE,
  HINT_TAP,
  KEY,
  START_NODE,
} from '../lib'
import { useGame, useNavigation, useWheel } from '../lib/hooks'
import { materials } from '../lib/materials'
import { Hints } from './Hints'
import { Ida } from './Ida'
import { Level } from './Level'
import { TapIndicator } from './TapIndicator'

const tapGeo = new PlaneGeometry(1, 1).rotateX(-HALF_PI)

export function Game() {
  const { solved, started, solve, end } = useGame()

  const [tapHint, setTapHint] = useState(true)
  const [rotateHint, setRotateHint] = useState(true)

  const [tap, setTap] = useState({
    id: 0, // for re-renders - allows repeated taps
    i: 0, // for position
  })

  const wheel = useWheel({ axis: 'x' })

  const player = useNavigation({
    onNavigate(current, to) {
      //Ida is going onto the bridge. Lock it.
      if (to) wheel.lock(BRIDGE.has(to))
      // Ida clicked pressure plate
      if (current == KEY) solve()
      // Ida reached exit
      if (current == EXIT) end()

      // Hide hints
      if (current == HINT_TAP) setTapHint(false)
      if (current == HINT_ROTATE) setRotateHint(false)
    },
    canNavigate(current, to) {
      // Ida is going to exit without solving
      if (to == EXIT && !solved) return false

      const pos = wheel.position.current
      const dragging = wheel.dragging.current

      // Ida is going onto bridge while we're dragging the wheel
      if (dragging && BRIDGE.has(to)) return false
      // Ida is going onto bridge while it's not in correct position
      if (pos != 3 && current < GAP_START && to >= GAP_START) return false
      if (pos != 3 && current > GAP_END && to <= GAP_END) return false
      // Ida is going to branch B while bridge is not in correct position
      if (pos != 1 && BRANCH_B.has(to)) return false
      // Ida is going onto the bridge from branch B while bridge is not in correct position
      if (pos != 1 && current == KEY) return false
      // Ida is going to the fork while bridge is not in correct position
      if (pos == 2 && to == FORK) return false

      return true
    },
  })

  function handleNavigate(i: number) {
    if (player.navigate(i)) {
      setTap(({ id }) => ({ id: id + 1, i }))
    }
  }

  return (
    <group>
      <group position={[-0.5, 1, 0.5]}>
        {tap.id > 0 ? (
          <TapIndicator key={tap.id} position={GRAPH[tap.i].pos} />
        ) : null}

        {GRAPH.map((node, i) => (
          <mesh
            layers={2}
            key={i}
            visible={false}
            position={node.pos}
            geometry={tapGeo}
            material={materials.debug}
            onClick={() => handleNavigate(i)}
          />
        ))}
      </group>

      <Level solved={solved} wheel={wheel} />

      <Ida
        layers={2}
        ref={player.ref}
        animation={player.animation}
        position={GRAPH[START_NODE].pos}
      />

      {started && (
        <Hints
          tap={tapHint}
          rotate={!tapHint && rotateHint && wheel.position.current == 0}
        />
      )}
    </group>
  )
}
