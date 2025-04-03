import { useRef, useState } from 'react'

import clsx from 'clsx'

import { Close, FilePresent, Upload } from 'app/assets/svg'
import type { TorrentObject } from 'app/lib/torrent-tools'

import { fileToArrayBuffer } from '../lib'

const dragClasses = {
  on: 'scale-102 animate-pulse-glow border-purple-400 bg-purple-400/10',
  off: 'border-purple-100/40 hover:border-purple-400',
  error: 'scale-102 animate-pulse-glow border-red-400 bg-red-400/10 ',
}

type DropZoneProps = {
  torrentObject?: TorrentObject
  onFileUpload: (payload: ArrayBuffer) => void
  onReset: () => void
}

export function DropZone({
  torrentObject,
  onFileUpload,
  onReset,
}: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragStatus, setDragStatus] = useState<keyof typeof dragClasses>('off')

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.name.endsWith('.torrent')) {
      const arrayBuffer = await fileToArrayBuffer(selectedFile)
      onFileUpload(arrayBuffer)
    }
  }

  function handleReset() {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      onReset()
    }
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    const files = [...e.dataTransfer.items]

    if (files.length === 1) {
      const { kind, type } = files[0]
      if (kind === 'file' && type === 'application/x-bittorrent') {
        return setDragStatus('on')
      }
    }
    setDragStatus('error')
  }

  function handleDragLeave() {
    setDragStatus('off')
  }

  function handleDrop() {
    setDragStatus('off')
  }

  return (
    <section
      aria-labelledby='dropzone-title'
      aria-describedby='dropzone-instructions'
      className={clsx(
        'group relative rounded-xl border-2 border-dashed transition duration-500',
        dragClasses[dragStatus],
        torrentObject && 'bg-purple-900/20',
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <label>
        <span id='dropzone-title' className='sr-only'>
          Upload a torrent file
        </span>
        <input
          ref={fileInputRef}
          type='file'
          accept='.torrent'
          onChange={handleFileUpload}
          className='absolute inset-0 cursor-pointer opacity-0'
        />
      </label>

      <div
        className={clsx(
          'pointer-events-none text-center text-purple-300',
          torrentObject ? 'p-8' : 'px-8 py-14',
        )}>
        {!torrentObject ? (
          <div id='dropzone-instructions' className='animate-fade-in'>
            <Upload
              aria-hidden
              className={clsx(
                'mx-auto mb-4 size-16 fill-current',
                'transition-transform duration-300 group-hover:scale-110',
              )}
            />
            <h2 className='mb-2 text-lg font-medium text-white'>
              Drop your torrent file here
            </h2>
            <p className='text-sm'>or click to browse your files</p>
          </div>
        ) : (
          <div className='animate-fade-in flex gap-x-4'>
            <div
              aria-live='polite'
              className='flex min-w-0 flex-1 items-center gap-x-3'>
              <FilePresent
                aria-hidden
                className='size-8 flex-shrink-0 fill-current'
              />
              <span className='truncate text-purple-100'>
                {torrentObject.info.name}
              </span>
            </div>
            <button
              onClick={handleReset}
              className={clsx(
                'pointer-events-auto cursor-pointer outline-none',
                'hover:rotate-90 hover:bg-white/10 focus-visible:rotate-90 focus-visible:bg-white/10',
                'flex-shrink-0 rounded-full p-2 transition-all duration-300',
              )}
              aria-label='Clear selected file'>
              <Close aria-hidden className='size-5 fill-current' />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
