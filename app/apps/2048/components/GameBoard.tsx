import { memo } from 'react'

import clsx from 'clsx'
import { AnimatePresence } from 'motion/react'

import { useDirectionalKeyDown, useDirectionalSwipe } from 'app/hooks'

import { type Board, type Direction, TILE_SIZE } from '../lib'
import { Overlay } from './Overlay'
import { TileBlock } from './TileBlock'

type GameBoardProps = {
  board: Board
  onMove: (direction: Direction) => void
  onContinue?: () => void
  onReset: () => void
  isWon: boolean
  isLost: boolean
} & React.ComponentProps<'section'>

export const GameBoard = memo(
  ({
    board,
    onMove,
    onContinue,
    onReset,
    isWon,
    isLost,
    ...props
  }: GameBoardProps) => {
    // handle swipe gestures and arrow keys to move.
    useDirectionalKeyDown({ handler: onMove, disabled: isLost })
    useDirectionalSwipe({ handler: onMove, disabled: isLost })

    return (
      <section className='mx-auto pt-10' {...props}>
        <div className='relative m-2 aspect-square size-[525px] max-h-[90vw] max-w-[90vw]'>
          <div
            className={clsx(
              'bg-board',
              // Q: What does 'inset' do here??
              // A: We are using percentages to place and shift tiles around.
              // That means we need a square that's perfectly splittable by 4 (25%) to be able to say, shift this tile 50% or 75%, etc.
              // The outer div (the relative one) needs some padding, but that messes up the percentages. So, we use inset instead.
              'absolute -inset-2',
              'grid gap-3.5 rounded-3xl p-3.5',
            )}
            style={{
              gridTemplateRows: `repeat(${TILE_SIZE}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${TILE_SIZE}, minmax(0, 1fr))`,
            }}>
            {Array.from({ length: TILE_SIZE ** 2 }).map((_, i) => (
              <div key={i} className='tile-empty rounded-lx size-full' />
            ))}
          </div>
          {board
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map((tile) => <TileBlock key={tile.id} {...tile} />)}
          <AnimatePresence>
            {isWon ? (
              <Overlay title='You Win!' className='bg-[#edc02e]/50 text-white'>
                <button
                  className='pl-5.5 cursor-pointer px-2'
                  onClick={onContinue}>
                  Continue
                </button>
                |
                <button className='cursor-pointer px-2' onClick={onReset}>
                  New Game
                </button>
              </Overlay>
            ) : null}
            {isLost ? (
              <Overlay
                title='Game Over!'
                className='bg-[#eee4da]/50 text-[#756452]'>
                <button className='cursor-pointer px-2' onClick={onReset}>
                  Try Again
                </button>
              </Overlay>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    )
  },
)

GameBoard.displayName = 'GameBoard'
