/**
 * Represents a value in Bencode format, which is arrays or objects of strings and numbers.
 */
export type BencodeType =
  | string
  | number
  | BencodeType[]
  | { [key: string]: BencodeType }

export type SingleFileTorrent = {
  /** Suggested name for the file. */
  name: string
  /** Total size of the file in bytes. */
  length: number
  /** Optional MD5 checksum of the file. */
  md5sum?: string
}

export type MultiFileTorrent = {
  /** Suggested name for the directory. */
  name: string
  /** List of files included in the torrent. */
  files: Array<{
    /** Size of the file in bytes. */
    length: number
    /** Path segments to the file within the torrent. */
    path: string[]
    /** Optional MD5 checksum of the file. */
    md5sum?: string
  }>
}

/** Represents a decoded `.torrent` file structure.
 * @see {@link https://wiki.theory.org/BitTorrentSpecification#Metainfo_File_Structure}
 */
export type TorrentObject = {
  /** The URL of the primary tracker. */
  announce?: string
  /** A list of tracker URLs for redundancy. Each inner array represents a tier of trackers. */
  'announce-list'?: string[][]
  /** Core metadata about the torrent content. */
  info: {
    /** The number of bytes per piece. */
    'piece length': number
    /** Concatenated SHA-1 hashes of all pieces. */
    pieces: string
    /** Indicates if the torrent is private (1) or public (0 or undefined). */
    private?: 1 | 0
  } & (SingleFileTorrent | MultiFileTorrent)

  /** Optional comment provided by the creator. */
  comment?: string
  /** Name and version of the program used to create the torrent. */
  'created by'?: string
  /** Unix timestamp indicating when the torrent was created. */
  'creation date'?: number
  /** Character set used for encoding strings. */
  encoding?: string
}

/**
 * Represents a decoded magnet URI.
 */
export type MagnetObject = {
  /** Exact Topic: in this case the BitTorrent info hash. This value is required and should follow the format 'urn:btih:<hash>'. */
  xt: string
  /** Display Name: A filename to display to the user. */
  dn?: string
  /** eXact Length: The file size, in bytes. */
  xl?: string
  /** Address Tracker: List of tracker URLs.. */
  tr?: string[]
  /** Web Seed: The payload data served over HTTP/S */
  ws?: string[]
  /** Acceptable Source: Refers to a direct download from a web server. */
  as?: string[]
  /** eXact Source: A list of direct source URLs. */
  xs?: string[]
  /** Keyword Topic: Specifies a string of search keywords to search for in P2P networks. */
  kt?: string[]
  /** Manifest Topic: Link to the metafile that contains a list of magnets. */
  mt?: string
  /** Select Only: Lists specific files torrent clients should download by index/range (Example "0,2,4-6"). */
  so?: string
  /** PEer: Specifies fixed peer addresses to connect to. */
  'x.pe'?: string[]
}
