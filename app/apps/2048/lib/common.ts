export type Tile = {
  id: string
  x: number
  y: number
  value: number
}

export type Board = Tile[]

/** The direction in which a board can move its tiles. */
export type Direction = 'up' | 'down' | 'left' | 'right'

export type State = {
  /** The current state of the board, represented as a flat array of tiles. */
  board: Board
  /** The current score of the game. */
  score: number
  /** The best score recorded so far. */
  best: number
  /** Determines if we should spawn a new tile and if we need to re-render the React component */
  updated: boolean
  /** If the player has reached 2048. The player may continue playing after doing that */
  won: boolean
}

export const APP_ID = '2048'
export const TILE_SIZE = 4
export const LOCALSTORAGE_ID = `${APP_ID}_${TILE_SIZE}`
export const WIN_THRESHOLD = 2 ** 11 // 2048

export const directionKeyCodes: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
}
