import { memo, useEffect, useState } from 'react'

import { AlertTriangle, Check } from 'app/assets/svg'

import { FILE_LIMIT, formatBytes } from '../lib'

type File = {
  length: number
  path: string[]
}

type FileSelectorProps = {
  files: File[]
  onChange: (indexes: Set<number>) => void
}

export const FileSelector = memo(({ files, onChange }: FileSelectorProps) => {
  const [selectedIndexes, setSelectedIndexes] = useState(new Set<number>())

  useEffect(() => {
    onChange(selectedIndexes)
  }, [selectedIndexes])

  const isOverLimit = files.length > FILE_LIMIT

  function toggleFile(index: number) {
    if (isOverLimit) return

    setSelectedIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function toggleAll() {
    if (isOverLimit) return

    setSelectedIndexes((prev) =>
      prev.size === files.length ? new Set() : new Set(files.map((_, i) => i)),
    )
  }

  if (isOverLimit) {
    return (
      <div className='animate-fade-in'>
        <div className='mb-3 flex items-center gap-2'>
          <h3 className='text-xs font-medium text-purple-200'>Files</h3>
          <span className='text-[10px] text-purple-300'>
            ({files.length.toLocaleString()} files)
          </span>
        </div>
        <div className='rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4'>
          <div className='flex items-center gap-2 text-yellow-300'>
            <AlertTriangle className='h-4 w-4 fill-current' />
            <p className='text-xs'>
              File selection is disabled for torrents with more than{' '}
              {FILE_LIMIT.toLocaleString()} files.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='animate-fade-in'>
      <div className='mb-1.5 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-xs font-medium text-purple-200'>Files</h3>
          <span className='text-[10px] text-purple-300'>
            ({files.length.toLocaleString()} files)
          </span>
        </div>
        <button
          onClick={toggleAll}
          className='text-xs text-purple-300 transition-colors hover:text-purple-200'>
          {selectedIndexes.size === files.length
            ? 'Deselect All'
            : 'Select All'}
        </button>
      </div>
      <div className='custom-scrollbar max-h-32 space-y-1 overflow-y-auto'>
        {files.map((file, index) => {
          const isSelected = selectedIndexes.has(index)

          return (
            <button
              key={index}
              onClick={() => toggleFile(index)}
              className={`relative flex w-full items-center gap-2 overflow-hidden rounded px-2 py-1.5 transition-all duration-300 ${
                isSelected
                  ? 'border border-purple-500/30 bg-purple-500/10 text-purple-100'
                  : 'border border-transparent text-purple-300 hover:bg-white/5'
              }`}>
              {isSelected && (
                <div className='shimmer pointer-events-none absolute inset-0' />
              )}
              <div
                className={`flex h-3.5 w-3.5 items-center justify-center rounded border transition-all duration-300 ${
                  isSelected
                    ? 'rotate-0 border-purple-500 bg-purple-500'
                    : 'rotate-90 border-purple-400'
                }`}>
                {isSelected && <Check className='h-2.5 w-2.5 fill-white' />}
              </div>
              <div className='min-w-0 flex-1 text-left'>
                <div className='truncate text-xs'>{file.path.join('/')}</div>
                <div className='text-[10px] opacity-60'>
                  {formatBytes(file.length)}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
})

FileSelector.displayName = 'FileSelector'
