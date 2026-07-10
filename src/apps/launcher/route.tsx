import { Link } from 'react-router'

import clsx from 'clsx'

import { Github, LinkedIn, Mail, Twitter } from 'src/assets'
import type { AppMetadata } from 'src/lib/types'

import { apps } from '../index'

export function meta() {
  return [
    { title: 'Portfolio' },
    { name: 'apple-mobile-web-app-title', content: 'My Portfolio' },
    { name: 'description', content: 'My portfolio' },
  ]
}

export function links() {
  return [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon/favicon.svg',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '96x96',
      href: '/favicon/favicon-96x96.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon/apple-touch-icon.png',
    },
  ]
}

const APPS = Object.values(apps)
const SOCIAL_LINKS = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:you@example.com',
    Icon: Mail,
    className: 'fill-neutral-400 hocus:fill-neutral-800',
  },
  {
    id: 'github',
    label: 'Github',
    href: '#',
    Icon: Github,
    className: 'text-neutral-200 hocus:text-neutral-700',
  },
  {
    id: 'x-twitter',
    label: 'X (Twitter)',
    href: '#',
    Icon: Twitter,
    className: 'text-sky-500',
  },
  {
    id: 'linkedIn',
    label: 'LinkedIn',
    href: '#',
    Icon: LinkedIn,
    className: 'text-blue-500',
  },
] as const

export default function Launcher() {
  return (
    <div
      className={clsx(
        'flex min-h-lvh flex-col justify-between',
        'vlg:gap-8 gap-6',
        'py-4 sm:py-6 lg:py-8',
        'text-shadow-xs',
      )}>
      <div
        aria-hidden
        className={clsx(
          'fixed inset-0 -z-10 h-lvh w-lvw',
          'wp-[liquid-darkness.svg] bg-cover bg-center bg-no-repeat',
        )}
      />
      <header className='@container flex flex-col items-center justify-end gap-3 text-center'>
        <div
          className={clsx(
            'l:size-[12lvh] p:size-[15lvh]',
            'overflow-hidden rounded-full bg-neutral-800 shadow-xl ring-1 ring-neutral-700',
          )}>
          <img
            src='/images/simo.svg'
            alt='Simo'
            className='size-full object-cover'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <div className='text-[2.5cqh] font-semibold leading-tight tracking-tight'>
            Simo
          </div>
          <div className='text-[1.5cqh] font-medium text-neutral-50/80'>
            I design and build for the web
          </div>
        </div>
      </header>

      <main
        className={clsx(
          'container mx-auto grid w-full grow content-center',
          'gap-x-4',
          'gap-y-6',
          'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4',
          // 'grid-cols-[repeat(auto-fit,minmax(min(100%,clamp(18vw,30vw,26rem)),1fr))]',
        )}>
        {APPS.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </main>

      <footer className='flex flex-col items-center justify-between gap-y-2'>
        <div className='flex items-center gap-2.5'>
          {SOCIAL_LINKS.map(({ id, label, Icon, href, className }) => (
            <a
              key={id}
              href={href}
              aria-label={label}
              className={clsx(
                'corner-squircle group flex h-10 items-center gap-2 rounded-full bg-neutral-700 px-4 text-sm font-semibold text-neutral-200 transition',
                'hocus:bg-neutral-200 hocus:text-neutral-900 outline-none',
              )}>
              <Icon aria-hidden className={clsx('size-4', className)} />
            </a>
          ))}
        </div>
        <div className='font-mono text-xs text-neutral-500'>©2026 Simo</div>
      </footer>
    </div>
  )
}

type AppCardProps = {
  app: AppMetadata
}

const cta: Record<AppMetadata['type'], string> = {
  game: 'Play',
  demo: 'View',
  music: 'Jam',
  utility: 'Use',
}

function AppCard({ app }: AppCardProps) {
  const Icon = app.Icon

  return (
    <Link
      prefetch='intent'
      to={`/${app.id}`}
      className={clsx(
        '@container group',
        'flex flex-col p-[2%]',
        'transition duration-200 ease-out',
        'active:scale-97 hocus:init:scale-103 outline-none',
      )}>
      <div
        className={clsx(
          'aspect-16/10 relative overflow-hidden rounded-[3.5cqw] shadow-lg shadow-black/20',
          app.wip
            ? 'border-[0.75cqw] border-orange-500'
            : 'border-[0.33cqw] border-white/10',
        )}>
        {app.wip ? (
          <img
            alt='Still in Beta'
            src='/images/beta.svg'
            className='absolute right-0 top-0 z-10 size-[20cqw]'
          />
        ) : null}
        <img
          draggable='false'
          loading='lazy'
          className={clsx(
            'size-full object-cover',
            'transform-gpu will-change-transform',
            app.wip && 'shadow-inner-xl shadow-black',
          )}
          src={`/og/${app.id}.avif`}
          alt={`${app.name} screenshot`}
          style={{ filter: app.wip ? 'url(#vignette)' : undefined }}
        />
      </div>

      <div className='mt-[1.25cqh] flex items-center gap-[3cqw]'>
        <Icon aria-hidden className='size-[14cqw] flex-none' />

        <div className='text-shadow-lg flex min-w-0 flex-1 flex-col gap-y-1.5 truncate'>
          <h3 className='text-[3.25cqw] font-semibold leading-tight text-white'>
            {app.name}
          </h3>
          <p className='text-[2.75cqw] text-white/70'>{app.description}</p>
        </div>

        <span
          className={clsx(
            // 'hidden sm:block',
            'flex-none rounded-full border border-neutral-200/20 px-[4.25cqw] py-[0.6cqh]',
            'text-[3.25cqw] font-semibold text-white transition',
            'group-hocus:bg-neutral-200/25',
          )}>
          {cta[app.type]}
        </span>
      </div>
    </Link>
  )
}
