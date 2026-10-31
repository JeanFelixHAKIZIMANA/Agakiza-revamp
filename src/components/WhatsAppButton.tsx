import { getTranslations } from 'next-intl/server'

export async function WhatsAppButton({ number }: { number?: string | null }) {
  const digits = number?.replace(/\D/g, '')
  if (!digits) return null
  const t = await getTranslations('whatsapp')
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(t('greeting'))}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('label')}
      title={t('label')}
      className="fixed right-4 bottom-4 z-50 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#1fb857] active:scale-[0.97] md:right-8 md:bottom-8"
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="currentColor" aria-hidden="true">
        <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.7 6.4 6.4 0 0 0 1.3 3.4 14.7 14.7 0 0 0 5.6 5c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.1-.3-.2-.6-.4Z" />
      </svg>
    </a>
  )
}
