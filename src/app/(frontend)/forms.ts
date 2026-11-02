'use server'

import { seatsLeft } from '@/lib/events'
import { getPayloadClient } from '@/lib/payload'

export type FormState = { status: 'idle' | 'success' | 'error' | 'invalid'; fields?: string[] }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Reads and checks the submitted fields. Returns the cleaned values, or the
// names of the fields that need fixing.
function read(formData: FormData, rules: Record<string, (value: string) => boolean>) {
  const values: Record<string, string> = {}
  const invalid: string[] = []
  for (const [name, isValid] of Object.entries(rules)) {
    const value = String(formData.get(name) ?? '').trim()
    values[name] = value
    if (!isValid(value)) invalid.push(name)
  }
  return { values, invalid }
}

const required = (value: string) => value.length > 0 && value.length <= 200
const optional = (value: string) => value.length <= 2000
const email = (value: string) => emailPattern.test(value)
const phone = (value: string) => value.replace(/\D/g, '').length >= 9
const people = (value: string) => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 100
const locale = (formData: FormData) => (formData.get('locale') === 'en' ? 'en' : 'rw')
const isBot = (formData: FormData) => Boolean(formData.get('website'))
const consent = (formData: FormData) => formData.get('subscribe') === 'on'

// "2026-11-20T14:30" from a datetime-local input, read as Central Africa Time (UTC+2).
function kigaliToIso(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const date = new Date(`${value}:00+02:00`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export async function submitBooking(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: 'success' }
  const { values, invalid } = read(formData, {
    type: (value) => value === 'family-therapy' || value === 'advisory',
    names: required,
    phone,
    email,
    attendants: people,
    location: required,
    preferredDate: (value) => !value || kigaliToIso(value) !== null,
    note: optional,
  })
  if (invalid.length) return { status: 'invalid', fields: invalid }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'bookings',
      locale: locale(formData),
      // Run with visitor permissions so they can't set the booking status.
      overrideAccess: false,
      data: {
        type: values.type as 'family-therapy' | 'advisory',
        names: values.names,
        phone: values.phone,
        email: values.email.toLowerCase(),
        attendants: Number(values.attendants),
        location: values.location,
        // datetime-local has no time zone; the visitor means Kigali time.
        preferredDate: values.preferredDate ? kigaliToIso(values.preferredDate) : undefined,
        note: values.note || undefined,
        subscribe: consent(formData),
        // Required by the type; field access drops it and the default (pending) applies.
        status: 'pending',
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: 'success' }
  const { values, invalid } = read(formData, {
    names: required,
    email,
    message: (value) => value.length > 0 && value.length <= 5000,
  })
  if (invalid.length) return { status: 'invalid', fields: invalid }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'messages',
      locale: locale(formData),
      overrideAccess: false,
      data: {
        names: values.names,
        email: values.email.toLowerCase(),
        message: values.message,
        subscribe: consent(formData),
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}

export async function registerForEvent(_prev: FormState, formData: FormData): Promise<FormState> {
  if (isBot(formData)) return { status: 'success' }
  const { values, invalid } = read(formData, {
    event: (value) => Number.isInteger(Number(value)) && Number(value) > 0,
    names: required,
    phone,
    email,
    attendants: people,
  })
  if (invalid.length) return { status: 'invalid', fields: invalid }

  try {
    const payload = await getPayloadClient()
    const event = await payload.findByID({ collection: 'events', id: Number(values.event), depth: 0, overrideAccess: false })
    const seats = await seatsLeft(event.id, event.capacity)
    if (!event.registrationOpen || new Date(event.startsAt) < new Date()) return { status: 'error' }
    if (seats !== null && seats < Number(values.attendants)) return { status: 'invalid', fields: ['attendants'] }

    await payload.create({
      collection: 'event-registrations',
      locale: locale(formData),
      overrideAccess: false,
      data: {
        event: event.id,
        names: values.names,
        phone: values.phone,
        email: values.email.toLowerCase(),
        attendants: Number(values.attendants),
        subscribe: consent(formData),
      },
    })
    return { status: 'success' }
  } catch {
    return { status: 'error' }
  }
}
