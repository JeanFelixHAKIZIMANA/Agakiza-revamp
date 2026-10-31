'use client'

import { useActionState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { subscribe, type SubscribeState } from '@/app/(frontend)/actions'

export function NewsletterForm() {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const [state, action, pending] = useActionState<SubscribeState, FormData>(subscribe, { status: 'idle' })

  if (state.status === 'success') {
    return <p className="text-sm font-medium text-gold">{t('success')}</p>
  }

  return (
    <form action={action} className="flex flex-col gap-2 sm:flex-row">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: real visitors never see or fill this. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="sr-only" htmlFor="newsletter-name">{t('name')}</label>
      <input
        id="newsletter-name"
        name="name"
        placeholder={t('name')}
        className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60"
      />
      <label className="sr-only" htmlFor="newsletter-email">{t('email')}</label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder={t('email')}
        className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-dark hover:text-white disabled:opacity-60"
      >
        {t('submit')}
      </button>
      {state.status === 'error' && <p className="text-sm text-red-300">{t('error')}</p>}
    </form>
  )
}
