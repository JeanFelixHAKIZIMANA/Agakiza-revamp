'use client'

import { useActionState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { subscribe, type SubscribeState } from '@/app/(frontend)/actions'

export function NewsletterForm() {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: 'idle' })

  if (state.status === 'success') {
    return <p className="text-sm text-white/80">{t('success')}</p>
  }

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: real visitors never see or fill this. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="sr-only" htmlFor="newsletter-name">{t('name')}</label>
      <input
        id="newsletter-name"
        name="name"
        placeholder={t('name')}
        className="h-11 w-full min-w-0 rounded-lg sm:w-auto sm:flex-1 border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/50 transition-colors duration-150 focus:border-white/30 focus:outline-none"
      />
      <label className="sr-only" htmlFor="newsletter-email">{t('email')}</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder={t('email')}
        className="h-11 w-full min-w-0 rounded-lg sm:w-auto sm:flex-1 border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/50 transition-colors duration-150 focus:border-white/30 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-lg bg-page px-5 text-sm font-medium text-ink transition-[background-color,transform] duration-150 ease-out hover:bg-white active:scale-[0.98] disabled:opacity-60"
      >
        {t('submit')}
      </button>
      {state.status === 'error' && <p className="w-full text-sm text-red-300">{t('error')}</p>}
    </form>
  )
}
