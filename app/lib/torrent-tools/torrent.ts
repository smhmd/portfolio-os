import bencode from './bencode'
import magnet from './magnet'
import type { MagnetObject, TorrentObject } from './types'

export async function torrentToMagnetObject(
  torrentObject: TorrentObject,
): Promise<MagnetObject> {
  // Get the bencode-encoded info dictionary as a string
  const infoBencoded = bencode.encode(torrentObject.info)

  // Convert the string to a Uint8Array for hashing
  // This is critical - we need the exact byte representation, not a UTF-8 interpretation
  const data = bencode.binaryEncode(infoBencoded)

  // Now hash the proper binary data
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)

  // Convert to hex format
  const infoHash = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  // Create the magnet object
  const magnetObject: MagnetObject = {
    xt: `urn:btih:${infoHash.toUpperCase()}`,
    dn: torrentObject.info.name,
  }

  // Handle trackers "tr"
  const trackers = [
    torrentObject.announce,
    ...(torrentObject['announce-list']?.flat() ?? []),
  ]

  magnetObject.tr = trackers.filter(Boolean) as string[]

  // Handle file length "xl"
  if ('length' in torrentObject.info) {
    magnetObject.xl = torrentObject.info.length.toString()
  } else if ('files' in torrentObject.info) {
    const totalLength = torrentObject.info.files.reduce(
      (sum, file) => sum + file.length,
      0,
    )
    magnetObject.xl = totalLength.toString()
  }
  return magnetObject
}

export async function torrentToMagnetURI(torrent: TorrentObject) {
  const magnetObject = await torrentToMagnetObject(torrent)
  return magnet.encode(magnetObject)
}
