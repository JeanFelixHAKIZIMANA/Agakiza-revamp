import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { BookingForm } from '@/components/forms/BookingForm'
import { SplitPage } from '@/components/PageIntro'
import { alternates } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  const tForms = await getTranslations({ locale, namespace: 'forms' })
  return { title: t('book'), description: tForms('bookingIntro'), alternates: alternates(locale, '/saba-umwanya') }
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  const tForms = await getTranslations('forms')

  return (
    <SplitPage title={t('book')} intro={tForms('bookingIntro')}>
      <BookingForm />
    </SplitPage>
  )
}
