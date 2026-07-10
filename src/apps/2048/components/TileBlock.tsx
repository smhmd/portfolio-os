import { memo, useEffect, useRef } from 'react'

import clsx from 'clsx'

import { isMobile } from 'src/lib/env'

import { type Tile, TILE_SIZE } from '../lib/common'

type TileBlockProps = Tile

export const TileBlock = memo(({ x, y, value }: TileBlockProps) => {
  // Track previous value to animate if new tile or newly merged tile
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  const isNew = previousValue.current === 0
  const isUpdated = value !== previousValue.current

  return (
    <div
      className={clsx(
        '@container duration-(--anim-duration) backface-hidden absolute',
        'p:sm:p-1 l:vsm:p-1 p-0.5',
      )}
      style={{
        transitionTimingFunction: 'cubic-bezier(.34,1.26,.8,1)',
        transform: `translate3d(${x * 100}%, ${y * 100}%, 0)`, // the magic ✨
        width: `calc(100%/${TILE_SIZE})`,
        height: `calc(100%/${TILE_SIZE})`,
      }}>
      <div
        style={
          {
            // Using container queries, we make the font smaller depending on how long the number
            // See .tile-generic
            '--digits': value.toString().length + 2,
          } as React.CSSProperties
        }
        className={clsx(
          isNew ? 'animate-spawn' : isUpdated ? 'animate-pop' : undefined,
          `tile-generic tile-${value}`,
          isMobile && 'shadow-none!', // for performance
          'flex items-center justify-center',
          'rounded-1.5xl size-full font-black',
          'corner-squircle supports-squircle:rounded-4xl',
        )}>
        {value}
      </div>
    </div>
  )
})

TileBlock.displayName = 'TileBlock'
