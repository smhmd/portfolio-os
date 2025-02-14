export type Tile = {
  id: string
  x: number
  y: number
  value: number
}

export type Board = Tile[]

export type Direction = 'up' | 'down' | 'left' | 'right'

export type State = {
  board: Board
  score: number
  moved: boolean
}

export const TILE_SIZE = 4

export const initialBoard = [
  { id: 'a', x: 0, y: 0, value: 2 },
  { id: 'b', x: 1, y: 0, value: 8 },
  { id: 'c', x: 2, y: 0, value: 4 },
  { id: 'd', x: 3, y: 0, value: 2 },
  { id: 'e', x: 0, y: 1, value: 32 },
  { id: 'f', x: 1, y: 1, value: 16 },
  { id: 'g', x: 2, y: 1, value: 8 },
  { id: 'h', x: 3, y: 1, value: 4 },
  { id: 'i', x: 0, y: 2, value: 64 },
  { id: 'j', x: 1, y: 2, value: 128 },
  { id: 'k', x: 2, y: 2, value: 256 },
  { id: 'l', x: 3, y: 2, value: 512 },
  { id: 'm', x: 0, y: 3, value: 8192 },
  { id: 'n', x: 1, y: 3, value: 4096 },
  { id: 'o', x: 2, y: 3, value: 2048 },
  { id: 'p', x: 3, y: 3, value: 1024 },
] satisfies Board

export const keyToDirectionMap: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
}
