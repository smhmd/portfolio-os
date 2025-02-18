import { memo, useEffect } from 'react'

import clsx from 'clsx'

import {
  type Board,
  type Direction,
  directionKeyCodes,
  TILE_SIZE,
} from '../lib'
import { TileBlock } from './TileBlock'

type GameBoardProps = {
  board: Board
  handleMove: (direction: Direction) => void
  handleContinue?: () => void
  handleReset: () => void
  isWon: boolean
  isLost: boolean
} & React.ComponentProps<'section'>

export const GameBoard = memo(
  ({
    board,
    handleMove,
    handleContinue,
    handleReset,
    isWon,
    isLost,
    className,
    ...rest
  }: GameBoardProps) => {
    useEffect(() => {
      if (isLost) return

      const controller = new AbortController()
      window.addEventListener(
        'keydown',
        (e) => {
          const direction = directionKeyCodes[e.code]
          if (direction) {
            e.preventDefault()
            handleMove(direction)
          }
        },
        { signal: controller.signal },
      )

      return () => {
        controller.abort()
      }
    }, [isLost])

    return (
      <section className={clsx('mx-auto pt-10', className)} {...rest}>
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
            {Array.from({ length: Math.pow(TILE_SIZE, 2) }).map((_, i) => (
              <div key={i} className='tile-empty rounded-lx size-full' />
            ))}
          </div>
          {board
            ?.sort((a, b) => a.id.localeCompare(b.id))
            ?.map((tile) => <TileBlock key={tile.id} {...tile} />)}
          {isWon ? (
            <Overlay title='You Win!' className='bg-[#edc02e]/50 text-white'>
              <button
                className='pl-5.5 cursor-pointer px-2'
                onClick={handleContinue}>
                Continue
              </button>
              |
              <button className='cursor-pointer px-2' onClick={handleReset}>
                New Game
              </button>
            </Overlay>
          ) : null}
          {isLost ? (
            <Overlay
              title='Game Over!'
              className='bg-[#eee4da]/50 text-[#756452]'>
              <button className='cursor-pointer px-2' onClick={handleReset}>
                Try Again
              </button>
            </Overlay>
          ) : null}
        </div>
      </section>
    )
  },
)

type OverlayProps = {
  title: string
} & React.ComponentProps<'div'>

const Overlay = memo(
  ({ title, className, children, ...props }: OverlayProps) => {
    return (
      <div
        className={clsx(
          'animate-fade-in absolute -inset-2 flex items-center justify-center rounded-3xl text-6xl font-bold',
          className,
        )}
        {...props}>
        <p>{title}</p>
        <div className='absolute bottom-[20%] flex items-center text-base'>
          {children}
        </div>
      </div>
    )
  },
)

GameBoard.displayName = 'GameBoard'
Overlay.displayName = 'GameBoardOverlay'
