import { useState } from 'react'

import { PlaneGeometry } from 'three'

import { HALF_PI } from 'src/lib/math'

import {
  BRIDGE,
  connects,
  EXIT,
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
    canNavigate(current, to) {
      // Never step onto the wheel structure mid-drag
      if (wheel.dragging.current && BRIDGE.has(to)) return false
      // Otherwise the graph decides, given the mechanism state
      return connects(current, to, { wheel: wheel.position.current, solved })
    },
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
