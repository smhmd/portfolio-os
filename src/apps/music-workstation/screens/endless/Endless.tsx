import clsx from 'clsx'

import { Hud, Item, Label } from '../../components/Hud'
import { COLORS, store, useTransport } from '../../lib'
import { endless, settings } from './sequencer'

const DOT_ON = '#c9c5c2'
const DOT_OFF = '#3a3734'

/**
 * The gate mask as a fixed-size SVG — a 4×4 grid of dot slots, so the HUD
 * never changes size (or jumps) as patterns change length.
 */
function Gate({ pattern }: { pattern: string }) {
  return (
    <svg width={30} height={30} viewBox='0 0 30 30' aria-hidden>
      {Array.from({ length: 16 }, (_, i) => (
        <circle
          key={i}
          cx={4 + (i % 4) * 7.33}
          cy={4 + Math.floor(i / 4) * 7.33}
          r={2}
          fill={
            i < pattern.length
              ? pattern[i] === '1'
                ? DOT_ON
                : DOT_OFF
              : 'none'
          }
        />
      ))}
    </svg>
  )
}

/** Endless is all HTML — no graphics beyond the gate dots. */
export default function Endless() {
  const context = store.use()
  const { division, swing, pattern, mode } = settings(context)
  const { sequence, playing } = context
  const head = useTransport(endless, playing)

  return (
    <>
      <Hud>
        <Item color={COLORS.blue} label='div'>
          1/{division}
        </Item>

        <Item color={COLORS.brown} label='swing'>
          {Math.round(swing * 100)}%
        </Item>

        <div className='flex items-center gap-2' style={{ color: COLORS.gray }}>
          <Gate pattern={pattern} />
          <Label>gate</Label>
        </div>

        <Item color={COLORS.orange}>
          <span
            className={clsx(
              mode === 'backward' && 'inline-block -scale-x-100',
            )}>
            {mode === 'forward' ? '←' : mode === 'backward' ? 'R' : 'S'}
          </span>
        </Item>
      </Hud>

      {/* While playing: the live position; while building: how many stored */}
      <div className='grid flex-1 place-items-center'>
        <span className='text-8xl font-thin tabular-nums leading-none text-white'>
          {playing && head >= 0 ? head + 1 : sequence.length}
        </span>
      </div>

      <div className='flex h-8 shrink-0 items-center justify-center gap-6'>
        <Label>⌫ delete</Label>
        <Label>␣ rest</Label>
        <Label>▶ play</Label>
      </div>
    </>
  )
}
