'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { type FormState, registerForEvent } from '@/app/(frontend)/forms'

import { Consent, Field, FormMeta, SubmitRow, Success } from './fields'

export function RegistrationForm({ eventId, maxAttendants }: { eventId: number; maxAttendants: number }) {
  const t = useTranslations('forms')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const [state, action, pending] = useActionState<FormState, FormData>(registerForEvent, { status: 'idle' })

  if (state.status === 'success') return <Success message={t('registerSuccess')} />

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <FormMeta locale={locale} />
      <input type="hidden" name="event" value={eventId} />
      <Field name="names" label={t('names')} state={state}>
        {(props) => <input {...props} autoComplete="name" required />}
      </Field>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="phone" label={t('phone')} state={state}>
          {(props) => <input {...props} type="tel" autoComplete="tel" inputMode="tel" required />}
        </Field>
        <Field name="email" label={t('email')} state={state}>
          {(props) => <input {...props} type="email" autoComplete="email" required />}
        </Field>
      </div>
      <Field name="attendants" label={t('attendants')} state={state}>
        {(props) => (
          <input {...props} type="number" min={1} max={maxAttendants} defaultValue={1} inputMode="numeric" required />
        )}
      </Field>
      <Consent />
      <SubmitRow pending={pending} label={tNav('register')} state={state} />
    </form>
  )
}
