import { useState, useEffect, useRef } from 'react'

const API = 'https://coding-learning-platform-4okh.onrender.com/api'

const TOPIC_LABELS = {
  basics: 'Basics',
  functions: 'Functions',
  oop: 'OOP',
  dom: 'DOM',
  async: 'Async',
  es6: 'ES6+',
  collections: 'Collections',
  pointers: 'Pointers',
  stl: 'STL',
}

const LEVEL_DOT = {
  Beginner: 'bg-emerald-500',
  Intermediate: 'bg-amber-500',
  Advanced: 'bg-rose-500',
}

const chip =
  'inline-flex items-center gap-1.5 rounded-md border border-stone-200 px-2 py-0.5 text-[11px] font-medium text-stone-600 dark:border-stone-800 dark:text-stone-400'

/* ───────────── Icons ───────────── */

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5" aria-hidden>
    <path d="M7 4.5v15l12-7.5-12-7.5Z" />
  </svg>
)
const CloseIcon = () => (
  <svg {...iconProps} className="h-4 w-4">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
const AlertIcon = () => (
  <svg {...iconProps} className="h-5 w-5">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.2v.1" />
  </svg>
)
const ExternalIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
  </svg>
)

/* ───────────── Pieces ───────────── */

function LevelTag({ level, className = '' }) {
  if (!level) return null
  return (
    <span className={`${chip} bg-white dark:bg-stone-900 ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[level] || 'bg-stone-400'}`} />
      {level}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-video animate-pulse bg-stone-100 dark:bg-stone-800" />
      <div className="space-y-2.5 p-4">
        <div className="h-3.5 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-stone-100 pt-1.5 dark:bg-stone-800" />
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
          : 'border-stone-300 text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
      }`}
    >
      {children}
    </button>
  )
}

/* ───────────── Video modal ───────────── */

function VideoModal({ video, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-stone-200 bg-[#fcfbf8] shadow-2xl dark:border-stone-800 dark:bg-stone-950"
      >
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4 dark:border-stone-800">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 sm:text-base dark:text-stone-50">
              {video.title}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span className="truncate">{video.channel}</span>
              <LevelTag level={video.level} />
              {video.topic && <span className={chip}>{TOPIC_LABELS[video.topic] || video.topic}</span>}
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close video"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-stone-200 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
          <p className="text-xs text-stone-500">
            Press{' '}
            <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
              Esc
            </kbd>{' '}
            to close
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-stone-300 px-3.5 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
          >
            Open on YouTube
            <ExternalIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ───────────── Video panel ───────────── */

// signature
export default function VideoPanel({ language = 'python', onSelect, activeId, compact = false, title = 'Video lessons' }) {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalVideo, setModalVideo] = useState(null)
  const [imgErrors, setImgErrors] = useState({})
  const [source, setSource] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const lastCardRef = useRef(null)

  // Language changed: reset filters and load the topic list
  useEffect(() => {
    setSelectedTopic('all')
    setTopics([])
    setImgErrors({})

    const ctrl = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`${API}/videos/${encodeURIComponent(language)}/topics`, { signal: ctrl.signal })
        const data = await res.json()
        if (res.ok) setTopics(data.topics || [])
      } catch {
        // Topic list is non-critical
      }
    })()
    return () => ctrl.abort()
  }, [language])

  // Load videos for the current language + topic
  useEffect(() => {
    const ctrl = new AbortController()
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const query = selectedTopic !== 'all' ? `?topic=${encodeURIComponent(selectedTopic)}` : ''
        const res = await fetch(`${API}/videos/${encodeURIComponent(language)}${query}`, { signal: ctrl.signal })
        let data = {}
        try {
          data = await res.json()
        } catch {}
        if (!res.ok) throw new Error(data.message || `Failed to load videos (${res.status})`)
        setVideos(data.videos || [])
        setSource(data.source || '')
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'Failed to load videos')
        setVideos([])
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    })()
    return () => ctrl.abort()
  }, [language, selectedTopic, reloadKey])

const openVideo = (video, el) => {
  if (onSelect) {
    onSelect(video)
    return
  }
  lastCardRef.current = el
  setModalVideo(video)
}

  const closeVideo = () => {
    setModalVideo(null)
    lastCardRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ───── Header ───── */}
      <div className="flex items-end justify-between gap-3 border-b border-stone-200 pb-4 dark:border-stone-800">
        <div>
          // heading, replace the text
<h2 className="font-serif text-xl tracking-tight text-stone-900 dark:text-stone-50">{title}</h2>
          {!loading && !error && (
            <p className="mt-1 text-xs text-stone-500">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'}
            </p>
          )}
        </div>

        {source === 'youtube' && <span className={chip}>Live from YouTube</span>}
        {source === 'fallback' && <span className={chip}>Curated library</span>}
      </div>

      {/* ───── Topic filters ───── */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          <FilterPill active={selectedTopic === 'all'} onClick={() => setSelectedTopic('all')}>
            All topics
          </FilterPill>
          {topics.map((topic) => (
            <FilterPill key={topic} active={selectedTopic === topic} onClick={() => setSelectedTopic(topic)}>
              {TOPIC_LABELS[topic] || topic}
            </FilterPill>
          ))}
        </div>
      )}

      {/* ───── Loading ───── */}
      {loading && (
        <div className={`grid grid-cols-1 gap-5 ${compact ? '' : 'sm:grid-cols-2'}`} aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ───── Error ───── */}
      {!loading && error && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-stone-200 bg-white px-6 py-12 text-center dark:border-stone-800 dark:bg-stone-900">
          <span className="text-rose-600 dark:text-rose-400">
            <AlertIcon />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">Couldn't load videos</p>
            <p className="mt-1 max-w-md text-xs text-stone-500">{error}</p>
          </div>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="inline-flex h-9 items-center rounded-md border border-stone-300 px-4 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Try again
          </button>
        </div>
      )}

      {/* ───── Empty ───── */}
      {!loading && !error && videos.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-stone-300 px-6 py-14 text-center dark:border-stone-700">
          <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">No videos for this topic yet</p>
          <p className="text-xs text-stone-500">Try a different topic, or view everything for this language.</p>
          {selectedTopic !== 'all' && (
            <button
              onClick={() => setSelectedTopic('all')}
              className="mt-1 text-xs font-medium text-stone-900 underline-offset-4 hover:underline dark:text-stone-100"
            >
              Show all videos
            </button>
          )}
        </div>
      )}

      {/* ───── Grid ───── */}
      {/* ───── Grid / playlist ───── */}
{!loading && !error && videos.length > 0 && (
  <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'grid-cols-1 gap-5 sm:grid-cols-2'}`}>
    {videos.map((video) => {
      const active = video.youtubeId === activeId
      return (
        <button
          key={video.youtubeId}
          onClick={(e) => openVideo(video, e.currentTarget)}
          aria-current={active ? 'true' : undefined}
          className={`group flex overflow-hidden rounded-xl border bg-white text-left transition-colors dark:bg-stone-900 ${
            compact ? 'flex-row' : 'flex-col'
          } ${
            active
              ? 'border-stone-900 dark:border-stone-100'
              : 'border-stone-200 hover:border-stone-400 dark:border-stone-800 dark:hover:border-stone-600'
          }`}
        >
          <div
            className={`relative aspect-video shrink-0 overflow-hidden bg-stone-100 dark:bg-stone-800 ${
              compact ? 'w-36 sm:w-44' : 'w-full'
            }`}
          >
            {!imgErrors[video.youtubeId] ? (
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
                onError={() => setImgErrors((prev) => ({ ...prev, [video.youtubeId]: true }))}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-stone-400">
                <PlayIcon />
              </div>
            )}

            {active ? (
              <span className="absolute inset-x-0 bottom-0 bg-stone-900/85 px-2 py-1 text-center text-[10px] font-medium uppercase tracking-wider text-white">
                Now playing
              </span>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-950/30 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-stone-900">
                  <PlayIcon />
                </span>
              </div>
            )}

            {!compact && <LevelTag level={video.level} className="absolute left-2.5 top-2.5 shadow-sm" />}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
            <p className="line-clamp-2 text-sm font-semibold leading-snug text-stone-900 dark:text-stone-50">
              {video.title}
            </p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="min-w-0 truncate text-xs text-stone-500">
                {video.channel}
                {compact && video.level ? ` · ${video.level}` : ''}
              </span>
              {!compact && video.topic && (
                <span className={`${chip} shrink-0`}>{TOPIC_LABELS[video.topic] || video.topic}</span>
              )}
            </div>
          </div>
        </button>
      )
    })}
  </div>
)}

      {modalVideo && <VideoModal video={modalVideo} onClose={closeVideo} />}
    </div>
  )
}