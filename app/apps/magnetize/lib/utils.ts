import { magnet, type MagnetObject } from 'app/lib/torrent-tools'

import { DUMMY_TORRENT, type Options } from './common'

// List of size units
const units = ['B', 'KB', 'MB', 'GB', 'TB']

/**
 * Converts a byte value into a human-readable format (B, KB, MB, etc.).
 *
 * @param {number} bytes - The size in bytes to be formatted.
 * @returns {string} The formatted size string with appropriate unit.
 */
export function formatBytes(bytes: number): string {
  // Tracks the index of the current unit (B, KB, MB, etc.)
  let unitIndex = 0

  // Divide the size by 1024 and move to the next unit if the value is larger than 1024,
  // and there are more units available in the units array.
  while (bytes >= 1024 && unitIndex < units.length - 1) {
    bytes /= 1024 // Divide by 1024 to move to the next unit
    unitIndex++ // Increment the unit index
  }

  // Format value to one decimal place and append the appropriate unit
  return `${bytes.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Reads a file and returns its content as an ArrayBuffer asynchronously.
 *
 * @param {File} file - The file to be read.
 * @returns {Promise<ArrayBuffer>} A promise that resolves with the file's content as an ArrayBuffer.
 */
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    // Resolves the promise with the file's content as an ArrayBuffer once the reading process is complete.
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    // Rejects the promise if an error occurs during file reading.
    reader.onerror = reject
    // Start reading the file as an ArrayBuffer
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Converts a magnet object into a properly formatted magnet URI string,
 * applying optional filters based on options/selectedFiles.
 *
 * @param {Object} params - The parameters for conversion.
 * @param {MagnetObject} params.magnet - The original magnet object.
 * @param {Options} params.options - User-defined options for formatting.
 * @param {string} [params.selectedFiles] - Optional list of selected files.
 * @returns {string} The formatted magnet URI.
 */
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

  // Create a deep copy to avoid mutating the original object
  const newMagnet = structuredClone(oldMagnet)

  if (!includeName) {
    // Remove display name if not included in `options`
    delete newMagnet.dn
  }
  if (!includeLength) {
    // Remove length attribute if not included in `options`
    delete newMagnet.xl
  }
  if (!includeMultiTrackers) {
    // Keep only the first tracker if multiple trackers are disabled in `options`
    newMagnet.tr = newMagnet.tr?.slice(0, 1)
  }
  if (!includeTracker) {
    // Remove all trackers if trackers are disabled in `options`
    delete newMagnet.tr
  }
  if (selectedFiles) {
    // Set selected file indices if provided
    newMagnet.so = selectedFiles
  } else {
    // Remove selection override if none is provided
    delete newMagnet.so
  }

  // Convert the modified object back into a magnet URI string
  return magnet.encode(newMagnet)
}

/**
 * Converts a set of file indices into a compact range string (e.g., "1-3,5").
 *
 * @param {Set<number>} indexSet - A set of numeric indices.
 * @returns {string | undefined} A compact string representation of index ranges or undefined if empty.
 */
export function indexesToRange(indexSet: Set<number>) {
  if (indexSet.size === 0) return undefined // Returns undefined if the index set is empty.

  const sorted = Array.from(indexSet).sort((a, b) => a - b) // Convert set to sorted array

  const ranges = [] // Array to store the formatted ranges
  let start = sorted[0] // Start of the current range
  let prev = start // Previous number in sequence
  let count = 1 // Count of consecutive numbers in range

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i]

    if (curr !== prev + 1) {
      // If there's a gap, finalize the previous range
      if (count > 2) {
        // Store as a range if more than 2 consecutive numbers
        ranges.push(`${start}-${prev}`)
      } else {
        // Store individually otherwise
        ranges.push(
          Array.from({ length: count }, (_, i) => start + i).join(','),
        )
      }

      start = curr // Reset start for the new range
      count = 1 // Reset count
    } else {
      count++ // Increase count if numbers are consecutive
    }

    prev = curr // Update previous value
  }

  // Handle the last range
  if (count > 2) {
    ranges.push(`${start}-${prev}`)
  } else {
    ranges.push(
      Array.from({ length: count }, (_, idx) => start + idx).join(','),
    )
  }

  return ranges.join(',') // Return the formatted string
}

export async function createDummyTorrent() {
  const encoder = new TextEncoder()
  const torrentBytes = encoder.encode(DUMMY_TORRENT)
  const torrentFile = new File([torrentBytes], 'dummy.torrent', {
    type: 'application/x-bittorrent',
  })

  const dt = new DataTransfer()
  dt.items.add(torrentFile)

  return await fileToArrayBuffer(dt.files[0])
}
