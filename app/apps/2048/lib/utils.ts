/**
 * @fileoverview Utility functions for managing a 2048 game board.
 *
 * @description This file provides helper functions manipulate a game board.
 * `moveTiles`: Moves all the tiles in the board left, right, up, or down.
 * `mergeTiles`: Merge overlapping tiles that became overlapped by after getting moved
 * `addTile`: Spawns a new tile in a random available position. Has 10% chance of spawning a 4 instead of a 2
 * `checkPlayable`: Checks and returns whether the game can continue or not.
 */

import {
  type Board,
  type Direction,
  type State,
  type Tile,
  TILE_SIZE,
} from './common'

export function moveTiles(
  board: Board,
  direction: Direction,
): Pick<State, 'board' | 'moved'> {
  /**
   * Returns whether the moveTiles function actually moved any tiles. If so, we can spawn a new tile, if not, we go back to the PLAYING state.
   */
  let moved = false
  const newBoard: Board = []

  const isForward = ['right', 'down'].includes(direction) // not efficient, but readable >_<
  const isVertical = ['up', 'down'].includes(direction)

  const groupBy = isVertical ? 'x' : 'y' // when the movement is vertical, "x" is contant so we can group by it
  const changeBy = isVertical ? 'y' : 'x' // when the movement is vertical, we change the "y" position

  // for 'down' and 'right', we go backwards; for 'up' and 'left', we go forward
  const step = isForward ? -1 : 1

  /**
   * This will make this:
   * [
   *   {x: 0, y: 1...},
   *   {x: 0, y: 2...},
   *   {x: 1, y: 3...}
   * ]
   * into this:
   * [
   *   [ {x: 0, y: 1...}, {x: 0, y: 2...} ],   // grouping into separate arrays by either "x" or "y"
   *   [ {x: 1, y: 3...} ]                     // in this case, we're grouping by "x"
   * ]
   *
   * If we're moving vertically, we group by "x" and update the y's, otherwise we'll group by "y" and update the x's
   */
  const groups: Tile[][] = Array.from({ length: TILE_SIZE }).map(() => [])

  board.forEach((tile) => {
    const key = tile[groupBy]
    groups[key].push(tile)
  })

  groups.forEach((row) => {
    // We sort the row based on "x" or "y" to move in order
    row.sort((a, b) => {
      // If we're moving right or down, we reverse the sorting order.
      if (isForward) return b[changeBy] - a[changeBy]
      return a[changeBy] - b[changeBy]
    })

    // We hold the last value here to compare it against the next one.
    // If they're the same, we don't update `newPosition` which will make them overlap (have the same position, basically)
    let lastValue: number | null = null
    // If we're moving right or down, the new "x" or "y" should be starting from 3 down to 0
    // if we're moving left or up, the new "x" or "y" should be starting from 0 upwards to 3
    let newPosition = isForward ? TILE_SIZE : -1

    row.forEach((tile) => {
      // We skip updating `newPosition` if the current value matches the one from the previous tile. So that they will overlap
      if (tile.value !== lastValue) {
        newPosition += step
      }

      if (tile[changeBy] !== newPosition) {
        moved = true
      }

      // we update "x" or "y" using the `newPosition`
      tile[changeBy] = newPosition

      if (tile.value === lastValue) {
        // we reset the lastValue when there is a match to not be greedy
        lastValue = null
      } else {
        // we update the lastValue to compare in the next iteration
        lastValue = tile.value
      }

      newBoard.push(tile)
    })
  })

  return {
    board: newBoard,
    moved,
  }
}

export function mergeTiles(
  board: Board,
  score: number,
): Pick<State, 'board' | 'score'> {
  let addedScore = 0

  const seen = new Set()
  const newBoard = board.reduce<Board>((acc, tile) => {
    const key = `${tile.x},${tile.y}`
    if (seen.has(key)) {
      // If it's a duplicate, multiply the value of the first occurrence by 2
      const existingTile = acc.find((t) => t.x === tile.x && t.y === tile.y)
      if (existingTile) {
        existingTile.value *= 2 // Multiply only the first occurrence
        addedScore += existingTile.value
      }
      return acc // Skip adding the duplicate
    }
    seen.add(key) // Mark the combination as seen
    acc.push(tile) // Add the tile to the newBoard
    return acc
  }, [])

  return {
    board: newBoard,
    score: score + addedScore,
  }
}

export function addTile(board: Board): Board {
  const occupied = new Set(board.map((tile) => `${tile.x},${tile.y}`))
  const available: { x: number; y: number }[] = []

  for (let x = 0; x < TILE_SIZE; x++) {
    for (let y = 0; y < TILE_SIZE; y++) {
      const key = `${x},${y}`
      if (!occupied.has(key)) {
        available.push({ x, y })
      }
    }
  }

  if (available.length === 0) return board

  const { x, y } = available[Math.floor(Math.random() * available.length)]
  const value = Math.random() < 0.1 ? 4 : 2 // %10 chance of getting a "4" tile
  const id = self.crypto.randomUUID()
  const newTile: Tile = {
    id,
    x,
    y,
    value,
  }

  return [...board, newTile]
}

export function checkLost(board: Board): boolean {
  if (board.length < TILE_SIZE * TILE_SIZE) return false

  const matrix = board.reduce<number[][]>(
    (acc, { x, y, value }) => {
      acc[x][y] = value
      return acc
    },
    Array.from({ length: TILE_SIZE }, () => Array(TILE_SIZE)),
  )

  const last = TILE_SIZE - 1

  for (let i = 0; i < last; i++) {
    for (let j = 0; j < last; j++) {
      const current = matrix[i][j]

      // Compare with right and below in one go
      if (matrix[i][j + 1] === current || matrix[i + 1][j] === current) {
        return false
      }
    }

    // Separate check for last column (only need to check below)
    if (matrix[i][last] === matrix[i + 1][last]) {
      return false
    }
  }

  // Separate check for the last row (only need to check right)
  for (let j = 0; j < last; j++) {
    if (matrix[last][j] === matrix[last][j + 1]) {
      return false
    }
  }

  return true
}
