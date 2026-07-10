import { Html } from '@react-three/drei'
import clsx from 'clsx'

import {
  PANEL_HTML_SCALE,
  PANEL_POSITION,
  PANEL_YAW,
  ROW_PITCH,
  ROW_SIZE,
} from '../lib/common'
import { dialogue } from '../lib/dialogue'
import { store } from '../lib/store'
import { Hitbox } from './Interact'

/**
 * The dialogue options: two halves sharing one world transform.
 *
 *   – A DOM panel (drei <Html transform> derives a CSS matrix3d from the
 *     camera each frame) that does *rendering only* — text layout, fonts,
 *     transitions. It is pointer-events-none and carries no handlers or
 *     data attributes.
 *   – One invisible <Hitbox> plane per row, which is what the crosshair
 *     focuses and taps hit (see Interact).
 *
 * Rows are fixed-height (h-11 + mb-1.5 = 50px pitch) so the DOM and the
 * planes can't drift; DEBUG_HITBOXES in common.ts shows the alignment.
 */
export function Choices() {
  const { node, speaking, focus } = store.use()
  const { choices } = dialogue[node]

  if (node === 'start' || speaking || !choices) return null

  const entries = Object.entries(choices)
  const top = ((entries.length - 1) / 2) * ROW_PITCH // rows centre on the anchor

  return (
    <group position={PANEL_POSITION} rotation-y={PANEL_YAW}>
      {entries.map(([, next], i) => (
        <Hitbox key={next} goto={next} position={[0, top - i * ROW_PITCH, 0]}>
          <planeGeometry args={ROW_SIZE} />
        </Hitbox>
      ))}

      <Html
        transform
        scale={PANEL_HTML_SCALE}
        wrapperClass='z-0!'
        className='pointer-events-none'>
        <ul
          className={clsx(
            'w-72 select-none font-serif transition-all duration-300 ease-out',
            'starting:translate-y-2 starting:opacity-0',
          )}>
          {entries.map(([text, next], i) => (
            <li
              key={next}
              className={clsx(
                'mb-1.5 flex h-11 items-center gap-2.5 border-l-2 px-3',
                'bg-linear-to-r to-transparent transition-colors duration-150',
                focus === next
                  ? 'border-amber-400 from-black/70 text-amber-300'
                  : 'border-white/25 from-black/40 text-white/90',
              )}>
              <span className='text-xs tabular-nums opacity-50'>{i + 1}</span>
              <span className='text-sm leading-snug'>{text}</span>
            </li>
          ))}
        </ul>
      </Html>
    </group>
  )
}
