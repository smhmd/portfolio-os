import type { BencodeType } from './types'
import { binaryDecode, binaryEncode } from './utils'

// Define constants for ASCII values relevant to the Bencode encoding.
const ASCII_ZERO = 0x30 // '0'
const ASCII_NINE = 0x39 // '9'
const ASCII_COLON = 0x3a // ':'
const ASCII_MINUS = 0x2d // '-'
const ASCII_I = 0x69 // 'i'
const ASCII_L = 0x6c // 'l'
const ASCII_D = 0x64 // 'd'
const ASCII_E = 0x65 // 'e'

/**
 * Decodes a Bencoded Uint8Array into its corresponding JavaScript data structure.
 *
 * Bencode supports four data types:
 * 1. Integers: Represented as i<integer>e. Example: i42e
 * 2. Strings: Represented as <length>:<string>. Example: 4:spam
 * 3. Lists: Represented as l<item1><item2>...e. Example: l4:spam4:eggse
 * 4. Dictionaries: Represented as d<key1><value1><key2><value2>...e. Example: d3:cow3:moo4:spam4:eggse
 *
 * @param {Uint8Array | ArrayBuffer | string} input - The Bencoded data as a Uint8Array.
 * @returns {BencodeType} - The decoded JavaScript object, which can be a string, number, array, or object.
 * @throws {Error} - Throws an error if the input data is invalid or cannot be decoded.
 */
function bencodeDecoder(input: Uint8Array | ArrayBuffer | string): BencodeType {
  // If the input is not encoded as a Uint8Array, we do it for you
  let data: Uint8Array

  if (input instanceof Uint8Array) {
    // If input is Unit8Array, use it.
    data = input
  } else if (input instanceof ArrayBuffer) {
    // If it's an ArrayBuffer, convert it.
    data = new Uint8Array(input)
  } else if (typeof input === 'string') {
    // If it's a string, encode it.
    data = binaryEncode(input)
  } else {
    // Input type is not supported.
    throw new Error(`decode input is invalid`)
  }

  // Initialize the position pointer to track our current location in the data.
  let position = 0

  /**
   * Decodes the next Bencoded element based on the current position.
   * Determines the type of element (string, integer, list, dictionary) and decodes accordingly.
   *
   * @returns {BencodeType} - The decoded element, which can be a string, number, array, or object.
   */
  function decodeNext(): BencodeType {
    // Ensure the data is not null or undefined.
    if (!data) {
      throw new Error(`Null data`)
    }

    // Ensure the current position is within the bounds of the data array.
    if (position >= data.length) {
      throw new Error(`Unexpected end of data at position ${position}`)
    }

    // Peek at the current byte to determine the type of the next element.
    const byte = data[position]

    // Check if the byte corresponds to a digit (indicating the start of a string).
    if (byte >= ASCII_ZERO && byte <= ASCII_NINE) {
      // '0' to '9'
      return decodeString()
    } else if (byte === ASCII_I) {
      // 'i' indicates an integer.
      return decodeInteger()
    } else if (byte === ASCII_L) {
      // 'l' indicates a list.
      return decodeList()
    } else if (byte === ASCII_D) {
      // 'd' indicates a dictionary.
      return decodeDictionary()
    } else {
      // If the byte doesn't match any known type indicators, throw an error.
      throw new Error(`Invalid token at position ${position}`)
    }
  }

  /**
   * Decodes a Bencoded string from the data array.
   * Strings are encoded as <length>:<string>. For example, 4:spam represents the string "spam".
   *
   * @returns {string} - The decoded string.
   * @throws {Error} - Throws an error if the string is malformed or if any decoding issues are encountered.
   */
  function decodeString(): string {
    // Ensure the data is not null or undefined.
    if (!data) {
      throw new Error(`Null data at position ${position}`)
    }

    // Ensure the current position is within the bounds of the data array.
    if (position >= data.length) {
      throw new Error(`Unexpected end of data at position ${position}`)
    }

    // Find the position of the colon (:) which separates the length from the string content.
    let colonPos = position
    while (colonPos < data.length && data[colonPos] !== ASCII_COLON) {
      colonPos++
    }

    // If no colon is found, the string encoding is invalid.
    if (colonPos === data.length) {
      throw new Error(`Missing ':' after length at position ${position}`)
    }

    // Extract the length of the string.
    const lengthStr = binaryDecode(data.subarray(position, colonPos))
    const length = parseInt(lengthStr, 10)

    // Validate the extracted length.
    if (isNaN(length) || length < 0) {
      throw new Error(
        `Invalid string length '${lengthStr}' at position ${position}`,
      )
    }

    // Calculate the end position of the string content.
    const end = colonPos + 1 + length

    // Ensure the data array contains enough bytes for the string content.
    if (end > data.length) {
      throw new Error(
        `Unexpected EOF while reading string at position ${position}`,
      )
    }

    // Extract and decode the string content.
    const str = binaryDecode(data.subarray(colonPos + 1, end))

    // Update the position for subsequent decoding.
    position = end

    // Return the decoded string.
    return str
  }

  /**
   * Decodes a Bencoded integer.
   * Integers are encoded as i<integer>e. For example, i42e represents the integer 42.
   *
   * @returns {number} - The decoded integer.
   */
  function decodeInteger(): number {
    // Verify the current byte is 'i' (start of integer).
    if (data[position] !== ASCII_I) {
      throw new Error(
        `Expected 'i' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    // Move past the 'i' character indicating the start of an integer.
    position++

    // Initialize a variable to accumulate the integer value.
    let value = 0
    let sign: 1 | -1 = 1

    // Check for negative sign.
    if (data[position] === ASCII_MINUS) {
      sign = -1
      position++
    }

    // Check if a negative sign is followed by a zero.
    if (sign === -1 && data[position] === ASCII_ZERO) {
      throw new Error(
        `Invalid integer value with a leading 0 at position ${position}`,
      )
    }

    // Decode the integer value.
    while (
      position < data.length &&
      data[position] >= ASCII_ZERO &&
      data[position] <= ASCII_NINE
    ) {
      value = value * 10 + (data[position] - ASCII_ZERO)
      // check if the first value is 0 but it's not followed by "e".
      if (value === 0 && data[position + 1] !== ASCII_E) {
        throw new Error(
          `Invalid integer value with a leading 0 at position ${position}`,
        )
      }
      position++
    }

    // If no digits were found, the integer encoding is invalid.
    if (
      value === 0 &&
      (data[position - 1] === ASCII_MINUS || data[position - 1] === ASCII_I)
    ) {
      throw new Error(`Invalid integer value at position ${position}`)
    }

    // Verify the current byte is 'e' (end of integer).
    if (data[position] !== ASCII_E) {
      throw new Error(
        `Expected 'e' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    position++

    // Multiply by the sign (potentially negative)
    return sign * value
  }

  /**
   * Decodes a Bencoded list.
   * Lists are encoded as l<item1><item2>...e. For example, l4:spam4:eggse represents the list ["spam", "eggs"].
   *
   * @returns {Array} - The decoded list as a JavaScript array.
   */
  function decodeList(): BencodeType[] {
    // Verify the current byte is 'l' (start of list).
    if (data[position] !== ASCII_L) {
      throw new Error(
        `Expected 'l' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    // Move past the 'l' character indicating the start of a list.
    position++

    // Initialize an array to hold the list elements.
    const list: Array<BencodeType> = []

    // Decode elements until the end of the list is reached.
    while (position < data.length && data[position] !== ASCII_E) {
      // Decode the next element and add it to the list.
      list.push(decodeNext())
    }

    // Verify the current byte is 'e' (end of list).
    if (data[position] !== ASCII_E) {
      throw new Error(
        `Expected 'e' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    position++

    // Return the decoded list.
    return list
  }
  /**
   * Decodes a Bencoded dictionary.
   * Dictionaries are encoded as d<key1><value1><key2><value2>...e.
   * For example, d3:cow3:moo5:sheep:baae represents the dictionary { "cow": "moo", "sheep": "baa" }.
   *
   * @returns {Object} - The decoded dictionary as a JavaScript object.
   */
  function decodeDictionary(): Record<string, BencodeType> {
    // Verify the current byte is 'd' (start of dictionary).
    if (data[position] !== ASCII_D) {
      throw new Error(
        `Expected 'd' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    // Move past the 'd' character indicating the start of a dictionary.
    position++

    // Initialize an object to hold the dictionary key-value pairs.
    const dictionary: Record<string, BencodeType> = {}

    // Decode key-value pairs until the end of the dictionary is reached.
    while (position < data.length && data[position] !== ASCII_E) {
      // Decode the key, which must be a string.
      const key = decodeString()
      // Decode the value associated with the key.
      const value = decodeNext()
      // Check for duplicate keys.
      if (key in dictionary) {
        throw new Error(`Duplicate key '${key}' at position ${position}`)
      }
      // Add the key-value pair to the dictionary.
      dictionary[key] = value
    }

    // Verify the current byte is 'e' (end of dictionary).
    if (data[position] !== ASCII_E) {
      throw new Error(
        `Expected 'e' at position ${position}, found '${String.fromCharCode(
          data[position],
        )}'`,
      )
    }
    position++

    // Return the decoded dictionary.
    return dictionary
  }

  return decodeNext()
}

/**
 * Encodes a Bencode type (string, number, list, or dictionary) into its Bencode representation.
 *
 * @param data - The Bencode data (string, number, list, or dictionary) to encode.
 * @returns The Bencode encoded string.
 * @throws Error if the input type is invalid or unsupported.
 */
function bencodeEncoder(data: BencodeType): string {
  if (typeof data === 'string') {
    return encodeString(data)
  } else if (typeof data === 'number') {
    return encodeInteger(data)
  } else if (Array.isArray(data)) {
    return encodeList(data)
  } else if (
    typeof data === 'object' &&
    data !== null &&
    Object.getPrototypeOf(data) === Object.prototype
  ) {
    return encodeDictionary(data)
  } else {
    throw new Error(`Unsupported data type: ${data}`)
  }
}

/**
 * Encodes a string into its Bencode representation.
 *
 * @param str - The string to encode.
 * @returns The Bencode encoded string.
 * @throws Error if the string contains invalid characters or is empty.
 */
function encodeString(str: string): string {
  return `${str.length}:${str}`
}

/**
 * Encodes an integer into its Bencode representation.
 *
 * @param num - The integer to encode.
 * @returns The Bencode encoded integer string.
 * @throws Error if the integer is not a valid Bencode integer.
 */
function encodeInteger(num: number): string {
  if (!Number.isInteger(num)) {
    throw new Error(`Invalid integer: ${num}`)
  }
  return `i${num}e`
}

/**
 * Encodes a list (array) into its Bencode representation.
 *
 * @param list - The list to encode.
 * @returns The Bencode encoded list string.
 * @throws Error if the list contains unsupported data types.
 */
function encodeList(list: BencodeType[]): string {
  return `l${list.map((item) => bencodeEncoder(item)).join('')}e`
}

/**
 * Encodes a dictionary into its Bencode representation.
 *
 * @param dict - The dictionary to encode.
 * @returns The Bencode encoded dictionary string.
 * @throws Error if the dictionary contains invalid keys or unsupported data types.
 */
function encodeDictionary(dict: Record<string, BencodeType>): string {
  if (Object.keys(dict).length === 0) {
    return 'de' // Handle empty dictionary case
  }

  let result = 'd' // Dictionaries start with 'd'

  // Get sorted keys to ensure lexicographic order
  const sortedKeys = Object.keys(dict).sort()

  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i]

    if (typeof key !== 'string') {
      throw new TypeError(
        `Invalid dictionary key: ${key}. Keys must be strings.`,
      )
    }

    // Encode key and value inline to avoid extra array allocations
    result += encodeString(key) + bencodeEncoder(dict[key])
  }

  return result + 'e' // Append 'e' to close dictionary
}

export const bencode = {
  decode: bencodeDecoder,
  encode: bencodeEncoder,
}
