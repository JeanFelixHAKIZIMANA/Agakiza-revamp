// The ministry runs on Central Africa Time (UTC+2, no daylight saving), so a
// "day" always means the calendar day in Kigali, as YYYY-MM-DD.
export const MINISTRY_TIME_ZONE = 'Africa/Kigali'

const dayFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: MINISTRY_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const kigaliDay = (date: Date = new Date()): string => dayFormat.format(date)
