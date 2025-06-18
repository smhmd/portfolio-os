import React, { useState } from 'react'

import clsx from 'clsx'

import { Check, Copy, Link } from 'app/assets'

interface MagnetLinkProps {
  link: string
}

function HighlightedMagnetLink({ link }: MagnetLinkProps) {
  // Split the magnet link into protocol, hash, and parameters
  const [protocol, rest] = link.split('?')
  const params = rest.split('&')

  return (
    <code className='whitespace-nowrap break-all font-mono text-xs leading-relaxed sm:whitespace-normal'>
      <span className='text-pink-400'>{protocol}</span>
      <span className='text-purple-400'>?</span>
      {params.map((param, index) => {
        const [key, value] = param.split('=')
        return (
          <React.Fragment key={index}>
            {index > 0 && <span className='text-purple-400'>&</span>}
            <span className='text-violet-300'>{key}</span>
            <span className='text-purple-400'>=</span>
            <span className='text-fuchsia-300'>{value}</span>
          </React.Fragment>
        )
      })}
    </code>
  )
}

export function MagnetLink({ link }: MagnetLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      aria-labelledby='magnet-link-title'
      className='animate-fade-in flex select-text flex-col gap-y-2'>
      <div className='flex items-center gap-1.5'>
        <Link aria-hidden className='size-3.5 fill-purple-300' />
        <h3
          id='magnet-link-title'
          className='text-sm font-medium text-purple-100'>
          Magnet Link
        </h3>
      </div>
      <div className='relative rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:border-purple-500/30'>
        <div
          className={clsx(
            'absolute transform rounded-lg bg-[#6f4090] backdrop-blur-xl sm:bg-transparent',
            'right-2 top-1/2 -translate-y-1/2',
            'sm:bottom-full sm:top-auto sm:mb-px sm:-translate-y-0',
          )}>
          <button
            onClick={handleCopy}
            className={clsx(
              'cursor-pointer px-2 py-1.5',
              'aspect-square rounded-lg border',
              'sm:aspect-auto sm:rounded-b-none sm:border-b-0',
              'flex items-center justify-center',
              'border-white/10',
              copied
                ? 'bg-green-500/10 fill-green-300 focus-visible:ring-green-500'
                : 'bg-purple-500/10 fill-purple-200 hover:bg-purple-500/30 focus-visible:ring-purple-500',
              'outline-none focus-visible:ring-2',
            )}>
            {copied ? (
              <Check
                aria-label='Converted magnet link is copied!'
                aria-live='assertive'
                className='size-3.5'
              />
            ) : (
              <Copy
                aria-label='Copy converted magnet link'
                className='size-3.5'
              />
            )}
          </button>
        </div>
        <div className='custom-scrollbar max-h-24 overflow-y-auto p-2'>
          <HighlightedMagnetLink link={link} />
        </div>
      </div>
    </section>
  )
}
