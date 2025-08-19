import { bencode } from './bencode'
import { magnet } from './magnet'
import type { MagnetObject, TorrentObject } from './types'
import { binaryEncode, bytesToHex } from './utils'

async function torrentToMagnetObject(
  torrentObject: TorrentObject,
): Promise<MagnetObject> {
  // Get the bencode-encoded info dictionary as a string
  const infoBencoded = bencode.encode(torrentObject.info)

  // Convert the string to a Uint8Array for hashing
  // This is critical - we are using binary encoding, not UTF-8 or any other encoding.
  const data = binaryEncode(infoBencoded)

  // Now hash the binary-encoded data
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)

  // Convert to hex format
  const infoHash = bytesToHex(hashBuffer)

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

async function torrentToMagnetURI(torrent: TorrentObject) {
  const magnetObject = await torrentToMagnetObject(torrent)
  return magnet.encode(magnetObject)
}

export const torrent = {
  torrentToMagnetObject,
  torrentToMagnetURI,
}
