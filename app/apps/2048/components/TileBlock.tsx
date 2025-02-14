import clsx from 'clsx'

import { type Tile, TILE_SIZE } from '../lib/common'

type TileBlockProps = Tile

export function TileBlock({ x, y, value }: TileBlockProps) {
  return (
    <div
      className='@container absolute transform-gpu p-1 duration-200'
      style={{
        translate: `calc(${x} * 100%) calc(${y} * 100%)`,
        width: `calc(100%/${TILE_SIZE})`,
        height: `calc(100%/${TILE_SIZE})`,
      }}>
      <div
        style={
          {
            // Using container queries, we make the font smaller depending on how long the number
            // See .tile-generic
            '--digits': (value * 100).toString().length,
          } as React.CSSProperties
        }
        className={clsx(
          `tile-generic tile-${value}`,
          'flex items-center justify-center',
          'rounded-1.5xl size-full font-black',
        )}>
        {value}
      </div>
    </div>
  )
}
