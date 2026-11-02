'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { type FormState, submitContact } from '@/app/(frontend)/forms'

import { Consent, Field, FormMeta, SubmitRow, Success } from './fields'

export function ContactForm() {
  const t = useTranslations('forms')
  const locale = useLocale()
  const [state, action, pending] = useActionState<FormState, FormData>(submitContact, { status: 'idle' })

  if (state.status === 'success') return <Success message={t('contactSuccess')} />

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <FormMeta locale={locale} />
      <Field name="names" label={t('names')} state={state}>
        {(props) => <input {...props} autoComplete="name" required />}
      </Field>
      <Field name="email" label={t('email')} state={state}>
        {(props) => <input {...props} type="email" autoComplete="email" required />}
      </Field>
      <Field name="message" label={t('message')} state={state}>
        {(props) => <textarea {...props} rows={6} className={`${props.className} h-auto py-3`} required />}
      </Field>
      <Consent />
      <SubmitRow pending={pending} label={t('send')} state={state} />
    </form>
  )
}
