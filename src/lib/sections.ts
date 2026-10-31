// Content sections, matching the footer groups agreed with the client.
export const sections = [
  { label: 'Amahugurwa', value: 'amahugurwa' },
  { label: 'Umuryango', value: 'umuryango' },
  { label: 'Isanamitima', value: 'isanamitima' },
  { label: 'Amakuru', value: 'amakuru' },
] as const

export type Section = (typeof sections)[number]['value']
