import React, { useState } from 'react'

import clsx from 'clsx'

import { Check, Copy, Link } from 'app/assets/svg'

interface MagnetLinkProps {
  link: string
}

function HighlightedMagnetLink({ link }: { link: string }) {
  // Split the magnet link into protocol, hash, and parameters
  const [protocol, rest] = link.split('?')
  const params = rest.split('&')

  return (
    <code
      className='select-text break-all font-mono text-xs leading-relaxed'
      onClick={(e) => {
        const text = e.currentTarget.innerText
        navigator.clipboard.writeText(text)
      }}>
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
  const disabled = !link

  const handleCopy = async () => {
    if (disabled) return
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='animate-fade-in mt-4'>
      <div className='flex justify-between'>
        <div className='mb-2 flex items-center gap-1.5'>
          <Link className='animate-pulse-glow h-3.5 w-3.5 fill-purple-300' />
          <h3 className='text-sm font-medium text-purple-100'>Magnet Link</h3>
        </div>
        <button
          onClick={handleCopy}
          disabled={disabled}
          className={clsx(
            'mx-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-t-lg px-2 text-xs font-medium',
            'border-x border-t border-white/10',
            copied
              ? 'bg-green-500/10 fill-green-300'
              : 'bg-purple-500/10 fill-purple-200 hover:bg-purple-500/30',
          )}>
          {copied ? (
            <Check className='size-3.5' />
          ) : (
            <Copy className='size-3.5' />
          )}
        </button>
      </div>
      <div className='overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 hover:border-purple-500/30'>
        <div className='custom-scrollbar max-h-24 overflow-y-auto p-2'>
          <HighlightedMagnetLink link={link} />
        </div>
      </div>
    </div>
  )
}
