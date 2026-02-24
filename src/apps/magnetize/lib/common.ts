export const APP_ID = 'magnetize'

/**
 * The limit of file count
 * before we don't automatically
 * show you the file picker in advanced options.
 */
export const FILE_LIMIT = 1000

export type Options = {
  includeName: boolean
  includeLength: boolean
  includeTracker: boolean
  includeMultiTrackers: boolean
}

/**
 * Content of a dummy torrent file for demo purposes.
 */
export const DUMMY_TORRENT = `
d 8:announce 18:http://tracker.org
4:info
  d 6:length i 0 e
  4:name 14:Sample.torrent
  12:piece_length i 0 e
  6:pieces 20:____________________
  5:files l
    d 6:length i 12,000,000 e
    4:path l 8:song.mp3 e e
    d 6:length i 200,000 e
    4:path l 9:image.png e e
    d 6:length i 2,000,000 e
    4:path l 12:document.pdf e e
  ee
e
`.replace(/,|[\s]+/g, '')
