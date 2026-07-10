import { memo } from 'react'

import clsx from 'clsx'
import { AnimatePresence } from 'motion/react'

import { useDirectionalKeyDown, useDirectionalSwipe } from 'src/hooks'
import { isMobile } from 'src/lib/env'
import type { Direction } from 'src/lib/types'

import { type Board, TILE_SIZE } from '../lib'
import { Overlay } from './Overlay'
import { TileBlock } from './TileBlock'

type GameBoardProps = {
  board: Board
  onContinue(): void
  onReset(): void
  onStartMove(direction: Direction): void
  onEndMove(): void
  isWon: boolean
  isLost: boolean
} & React.ComponentProps<'section'>

export const GameBoard = memo(
  ({
    className,
    board,
    onStartMove,
    onContinue,
    onReset,
    onEndMove,
    isWon,
    isLost,
    ...props
  }: GameBoardProps) => {
    // handle swipe gestures and arrow keys to move.
    useDirectionalKeyDown({ handler: onStartMove, disabled: isLost })
    useDirectionalSwipe({ handler: onStartMove, disabled: isLost })

    const cells = Array.from({ length: TILE_SIZE * TILE_SIZE }, () => 0)
    for (const { x, y, value } of board) cells[y * TILE_SIZE + x] = value

    return (
      <section
        className={clsx('flex items-center justify-center', className)}
        {...props}>
        <div
          className={clsx(
            'relative aspect-square size-[min(min(92vw,70vh),32rem)]',
            'l:vsm:m-2 p:sm:m-2 m-1',
          )}>
          <div
            className={clsx(
              'bg-board',
              'shadow-yellow-900/30 sm:shadow-2xl',
              isMobile && 'shadow-none!', // for performance

              // Q: What does 'inset' do here??
              // A: We are using percentages to place and shift tiles around.
              // That means we need a square that's perfectly splittable by 4 (25%) to be able to say, shift this tile 50% or 75%, etc.
              // The outer div (the relative one) needs some padding, but that messes up the percentages. So, we use inset instead.
              'absolute -inset-1',

              'grid gap-2 rounded-2xl p-2',
              'p:sm:-inset-2 p:sm:rounded-3xl p:sm:gap-3.5 p:sm:p-3.5',
              'l:vsm:-inset-2 l:vsm:rounded-3xl l:vsm:gap-3.5 l:vsm:p-3.5',
              'corner-squircle supports-squircle:rounded-4.5xl supports-squircle:p:sm:rounded-5xl supports-squircle:l:vsm:rounded-5xl',
            )}
            style={{
              gridTemplateRows: `repeat(${TILE_SIZE}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${TILE_SIZE}, minmax(0, 1fr))`,
            }}>
            {Array.from({ length: TILE_SIZE ** 2 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'tile-empty rounded-lx size-full',
                  'corner-squircle supports-squircle:rounded-3xl',
                )}
              />
            ))}

            <AnimatePresence>
              {isWon ? (
                <Overlay
                  title='You Win!'
                  className='bg-[#edc02e]/50 text-white'>
                  <button className='pl-5' onClick={onContinue}>
                    Continue
                  </button>
                  <span aria-hidden>|</span>
                  <button onClick={onReset}>New Game</button>
                </Overlay>
              ) : isLost ? (
                <Overlay
                  title='Game Over!'
                  className='bg-[#eee4da]/50 text-[#756452]'>
                  <button onClick={onReset}>Play Again</button>
                </Overlay>
              ) : null}
            </AnimatePresence>
          </div>

          <div aria-hidden onTransitionEnd={onEndMove}>
            {[...board]
              // we sort to make it stable for animations.
              ?.sort((a, b) => a.id.localeCompare(b.id))
              ?.map((tile) => <TileBlock key={tile.id} {...tile} />)}
          </div>
          <p className='sr-only' aria-live='polite' aria-atomic='true'>
            {`Board: ${cells.map((v) => v ?? 'empty').join(', ')}`}
          </p>
        </div>
      </section>
    )
  },
)

GameBoard.displayName = 'GameBoard'
