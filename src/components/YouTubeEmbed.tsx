import { youtubeId } from '@/lib/youtube'

export function YouTubeEmbed({ url, title }: { url: string | null | undefined; title: string }) {
  const id = youtubeId(url)
  if (!id) return null

  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-raised">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="size-full"
      />
    </div>
  )
}
