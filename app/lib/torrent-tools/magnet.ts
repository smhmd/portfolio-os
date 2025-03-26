import type { MagnetObject } from './types'

const encodedSingleValueParams = ['dn', 'mt'] as const
const nonEncodedSingleValueParams = ['xl', 'so'] as const

const allMultiValueParams = ['tr', 'ws', 'as', 'xs', 'kt', 'x.pe'] as const

/**
 * Decodes a magnet URI into a structured object.
 *
 * This function uses the URL API, which is robust and built into modern browsers,
 * to extract parameters from the magnet URI. It supports multiple tracker values
 * (tr) and gracefully omits missing parameters.
 *
 * @param {string} magnetURI - A magnet URI string to decode.
 * @returns {MagnetObject} An object representing the decoded magnet URI.
 * @throws {Error} Throws an error if the magnet URI does not use the 'magnet:' protocol or if the required 'xt' parameter is missing.
 */
export function decode(magnetURI: string): MagnetObject {
  // Use the URL constructor to decode the magnet URI.
  // The URL API automatically handles decoding of URL components.
  const url = new URL(magnetURI)

  // Ensure the URI uses the 'magnet:' scheme.
  if (url.protocol !== 'magnet:') {
    throw new Error("Invalid magnet URI: scheme must be 'magnet:'")
  }

  // Extract the required 'xt' parameter (exact topic).
  const xt = url.searchParams.get('xt')
  if (!xt) {
    throw new Error("Invalid magnet URI: missing 'xt' parameter")
  }

  const result: MagnetObject = { xt }

  // Iterate through each single-value parameter and add it if it exists.
  for (const param of [
    ...encodedSingleValueParams,
    ...nonEncodedSingleValueParams,
  ]) {
    const value = url.searchParams.get(param)
    if (value !== null) {
      result[param] = value
    }
  }

  // Iterate through each multi-value parameter and add it using getAll.
  for (const param of allMultiValueParams) {
    const value = url.searchParams.getAll(param)
    if (value.length > 0) {
      result[param] = value
    }
  }

  return result
}

/**
 * Encodes a MagnetURI object into a valid magnet URI string.
 *
 * This function takes an object of type MagnetURI and converts it into a valid magnet link.
 * It uses the URLSearchParams API to build the query string, ensuring proper encoding of parameters.
 * Multi-valued parameters, such as trackers (tr), are handled using URLSearchParams.append().
 *
 * @param {MagnetObject} magnet - The magnet URI object to encode.
 * @returns {string} A valid magnet URI string.
 * @throws {Error} Throws an error if the required 'xt' property is missing.
 */
export function encode(magnet: MagnetObject): string {
  // Ensure that the required parameter 'xt' is provided.
  if (!magnet.xt) {
    throw new Error("Invalid object: missing 'xt' property")
  }

  // Create an array for building the magnet link.
  const parts: [keyof MagnetObject, string][] = [['xt', magnet.xt]]

  // Iterate over each optional single-value parameter and add it.
  for (const key of encodedSingleValueParams) {
    const value = magnet[key]
    if (value !== undefined) {
      parts.push([key, encodeURIComponent(value)])
    }
  }

  // Iterate over each non-encoded parameter and add it.
  for (const key of nonEncodedSingleValueParams) {
    const value = magnet[key]
    if (value !== undefined) {
      parts.push([key, value])
    }
  }

  // Iterate over each optional multi-value parameter and add it.
  for (const key of allMultiValueParams) {
    const list = magnet[key]
    if (list && list.length) {
      for (const item of list) {
        parts.push([key, encodeURIComponent(item)])
      }
    }
  }

  // Return the final magnet URI string and replace the falsely encoded URN.
  return `magnet:?${parts.map((part) => part.join('=')).join('&')}`
}

export default {
  encode,
  decode,
}
