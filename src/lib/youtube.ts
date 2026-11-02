// Extracts the video id from the usual YouTube link shapes:
// youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, youtube.com/live/ID
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1) || null
    if (!parsed.hostname.endsWith('youtube.com')) return null
    const fromQuery = parsed.searchParams.get('v')
    if (fromQuery) return fromQuery
    const match = parsed.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)
    return match?.[1] ?? null
  } catch {
    return null
  }
}
