const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
  </svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export default function VideoPlayer({ video, onClose }) {
  return (
    <section
      aria-label="Video player"
      className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-stone-800 dark:bg-stone-900"
    >
      <div className="aspect-video bg-black">
        <iframe
          key={video.youtubeId}
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 dark:text-stone-50">
            {video.title}
          </h3>
          <p className="mt-1 truncate text-xs text-stone-500">
            {video.channel}
            {video.level ? ` · ${video.level}` : ''}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            YouTube
            <ExternalIcon />
          </a>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </section>
  )
}