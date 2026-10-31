export const longDate = (locale: string) =>
  new Intl.DateTimeFormat(locale === 'rw' ? 'rw-RW' : 'en-GB', { dateStyle: 'long', timeZone: 'Africa/Kigali' })
