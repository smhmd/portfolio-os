export function uuid(): string {
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  const randomBytes = crypto.getRandomValues(new Uint8Array(16))
  let byteIndex = 0
  let nibbleToggle = false // false => low nibble, true => high nibble

  function getNextNibble() {
    const byte = randomBytes[byteIndex]
    const nibble = nibbleToggle ? (byte >> 4) & 0xf : byte & 0xf
    nibbleToggle = !nibbleToggle
    if (!nibbleToggle) byteIndex++
    return nibble
  }

  return template.replace(/[xy]/g, (char) => {
    let value
    if (char === 'x') {
      value = getNextNibble()
    } else {
      // 'y' character: high bits must be 8, 9, a, or b
      value = (getNextNibble() & 0x3) | 0x8
    }
    return value.toString(16)
  })
}
