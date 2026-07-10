import { useEffect } from 'react'

import { ROOT_POSITION, ROOT_SCALE, SIMO_POSITION } from '../lib/common'
import { OPENER } from '../lib/dialogue'
import { store } from '../lib/store'
import { voice } from '../lib/voice'
import { Choices } from './Choices'
import { Hitbox, Interact } from './Interact'
import { Set } from './Set'
import { Simo } from './Simo'

/** Composition only — behaviour lives in the components it mounts. */
export default function Scene() {
  const node = store.use((s) => s.node)

  useEffect(() => {
    void voice.load() // warm the sheet while the splash is still up
    return voice.stop
  }, [])

  return (
    <group scale={ROOT_SCALE} position={ROOT_POSITION}>
      <Interact />
      <Simo />

      {/* "talk to Simo": his body is the target until the conversation starts.
          Gazed at on desktop, tapped on mobile — same hitbox. */}
      {node === 'start' && (
        <Hitbox
          goto={OPENER}
          position={[SIMO_POSITION[0], 1.2, SIMO_POSITION[2]]}>
          <cylinderGeometry args={[0.55, 0.55, 2.4, 8]} />
        </Hitbox>
      )}

      <Choices />
      <Set />
    </group>
  )
}
