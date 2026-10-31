'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { type FormState, submitBooking } from '@/app/(frontend)/forms'

import { Consent, Field, FormMeta, SubmitRow, Success } from './fields'

export function BookingForm() {
  const t = useTranslations('forms')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const [state, action, pending] = useActionState<FormState, FormData>(submitBooking, { status: 'idle' })

  if (state.status === 'success') return <Success message={t('bookingSuccess')} />

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <FormMeta locale={locale} />
      <Field name="type" label={t('type')} state={state}>
        {(props) => (
          <select {...props} defaultValue="family-therapy">
            <option value="family-therapy">{tNav('familyTherapy')}</option>
            <option value="advisory">{tNav('advisory')}</option>
          </select>
        )}
      </Field>
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
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="attendants" label={t('attendants')} state={state}>
          {(props) => <input {...props} type="number" min={1} max={100} defaultValue={1} inputMode="numeric" required />}
        </Field>
        <Field name="location" label={t('location')} state={state}>
          {(props) => <input {...props} autoComplete="address-level2" required />}
        </Field>
      </div>
      <Field name="preferredDate" label={t('preferredDate')} state={state}>
        {(props) => <input {...props} type="datetime-local" />}
      </Field>
      <Field name="note" label={t('note')} state={state}>
        {(props) => <textarea {...props} rows={4} className={`${props.className} h-auto py-3`} />}
      </Field>
      <Consent />
      <SubmitRow pending={pending} label={tNav('book')} state={state} />
    </form>
  )
}
