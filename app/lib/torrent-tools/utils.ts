/**
 * Decodes a Uint8Array into a string by treating each byte as an individual character.
 */
export function binaryDecode(bytes: Uint8Array): string {
  let result = ''
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i])
  }
  return result
}

/**
 * Encodes a string into a Uint8Array by converting each character to its byte representation
 */
export function binaryEncode(bytes: string): Uint8Array {
  const result = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    result[i] = bytes.charCodeAt(i) & 0xff
  }
  return result
}

let textDecoder: TextDecoder
let textEncoder: TextEncoder

/**
 * Decodes a string to a Uint8Array using UTF-8 encoding.
 */
export function utf8Decode(bytes: Uint8Array): string {
  textDecoder ??= new TextDecoder()
  return textDecoder.decode(bytes)
}

/**
 * Encodes a string to a Uint8Array using UTF-8 encoding.
 */
export function utf8Encode(bytes: string): Uint8Array {
  textEncoder ??= new TextEncoder()
  return textEncoder.encode(bytes)
}
