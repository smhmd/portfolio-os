import { encode } from 'app/lib/torrent-tools/magnet'
import type { MagnetObject } from 'app/lib/torrent-tools/types'

import type { Options } from './common'

export function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex++
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`
}

export function magnetToMagnetURI({
  magnet: oldMagnet,
  options,
  selectedFiles,
}: {
  magnet: MagnetObject
  options: Options
  selectedFiles?: string
}): string {
  const { includeName, includeLength, includeTracker, includeMultiTrackers } =
    options

  const newMagnet = structuredClone(oldMagnet)

  if (!includeName) {
    delete newMagnet.dn
  }
  if (!includeLength) {
    delete newMagnet.xl
  }
  if (!includeMultiTrackers) {
    newMagnet.tr = newMagnet.tr?.slice(0, 1)
  }
  if (!includeTracker) {
    delete newMagnet.tr
  }
  if (selectedFiles) {
    newMagnet.so = selectedFiles
  } else {
    delete newMagnet.so
  }

  return encode(newMagnet)
}

export function indexesToRange(indexSet: Set<number>) {
  // Early exit for empty set
  if (indexSet.size === 0) return undefined

  // Convert to sorted array in a single pass
  const sorted = Array.from(indexSet).sort((a, b) => a - b)

  const ranges = []
  let start = sorted[0]
  let prev = start
  let count = 1

  // Single pass through sorted array
  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]

    if (curr !== prev + 1) {
      // Decide range or individual numbers
      if (count > 2) {
        ranges.push(`${start}-${prev}`)
      } else {
        ranges.push([...Array(count)].map((_, idx) => start + idx).join(','))
      }

      // Reset for new range
      start = curr
      count = 1
    } else {
      count++
    }

    prev = curr
  }

  // Handle final range
  if (count > 2) {
    ranges.push(`${start}-${prev}`)
  } else {
    ranges.push([...Array(count)].map((_, idx) => start + idx).join(','))
  }

  return ranges.join(',')
}
