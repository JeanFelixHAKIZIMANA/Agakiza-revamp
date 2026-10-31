'use client'

import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

import type { FormState } from '@/app/(frontend)/forms'

const control =
  'h-11 w-full rounded-lg border bg-card px-3 text-ink transition-colors duration-150 ease-out placeholder:text-muted focus:border-brand focus:outline-none'

export function Field({
  name,
  label,
  state,
  children,
}: {
  name: string
  label: string
  state: FormState
  children: (props: { id: string; name: string; className: string; 'aria-invalid'?: true }) => ReactNode
}) {
  const invalid = state.fields?.includes(name)
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`field-${name}`} className="text-sm font-medium">
        {label}
      </label>
      {children({
        id: `field-${name}`,
        name,
        className: `${control} ${invalid ? 'border-red-600' : 'border-line'}`,
        ...(invalid ? { 'aria-invalid': true as const } : {}),
      })}
    </div>
  )
}

// Hidden fields every public form sends: the visitor's language and a honeypot.
export function FormMeta({ locale }: { locale: string }) {
  return (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    </>
  )
}

export function Consent() {
  const t = useTranslations('forms')
  return (
    <label className="flex items-start gap-3 text-sm text-secondary">
      <input type="checkbox" name="subscribe" className="mt-0.5 size-4 accent-brand" />
      {t('consent')}
    </label>
  )
}

export function SubmitRow({ pending, label, state }: { pending: boolean; label: string; state: FormState }) {
  const t = useTranslations('forms')
  return (
    <div className="flex flex-col gap-3">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center self-start rounded-lg bg-brand px-5 font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? t('sending') : label}
      </button>
      <p role="status" className="text-sm text-red-700">
        {state.status === 'invalid' && t('invalid')}
        {state.status === 'error' && t('error')}
      </p>
    </div>
  )
}

export function Success({ message }: { message: string }) {
  return (
    <div role="status" className="rounded-2xl border border-line bg-card p-8">
      <p className="font-serif text-2xl leading-snug">{message}</p>
    </div>
  )
}
