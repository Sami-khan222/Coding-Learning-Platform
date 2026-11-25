import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link, Navigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import VideoPanel from '../components/VideoPanel'
import VideoPlayer from '../components/VideoPlayer'

const API = 'https://coding-learning-platform-4okh.onrender.com/api'
const VALID_LANGS = ['python', 'javascript', 'java', 'cpp']
const LANG_NAMES = { python: 'Python', javascript: 'JavaScript', java: 'Java', cpp: 'C++' }

const ArrowLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ArrowRight = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function WatchPage() {
  const { lang, videoId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const stateVideo = location.state?.video
  const [video, setVideo] = useState(
    stateVideo?.youtubeId === videoId ? stateVideo : { youtubeId: videoId },
  )

  // Get the video details: from router state if we have them, otherwise from the API
  // (covers refreshes and direct links). The player works either way.
  useEffect(() => {
    if (stateVideo?.youtubeId === videoId) {
      setVideo(stateVideo)
      return
    }
    setVideo({ youtubeId: videoId })

    const ctrl = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(`${API}/videos/${encodeURIComponent(lang)}`, { signal: ctrl.signal })
        const data = await res.json()
        const found = (data.videos || []).find((v) => v.youtubeId === videoId)
        if (found) setVideo(found)
      } catch {
        // Not critical: the player still plays
      }
    })()
    return () => ctrl.abort()
  }, [videoId, lang, stateVideo])

  // New video picked: start at the top so the player is visible
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [videoId])

  if (!VALID_LANGS.includes(lang)) return <Navigate to="/" replace />

  const langName = LANG_NAMES[lang]

  // Pick another video without stacking history entries
  const playVideo = (next) => {
    navigate(`/watch/${lang}/${next.youtubeId}`, { state: { video: next }, replace: true })
  }

  return (
    <div className="min-h-dvh bg-[#fcfbf8] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Only control on this page: back */}
        <Link
          to={`/learn/${lang}`}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-stone-300 px-3.5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
        >
          <ArrowLeft />
          Back to {langName}
        </Link>

        <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Left column on desktop. "contents" lets mobile reorder its children. */}
          <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-8">
            <div className="order-1">
              <VideoPlayer
                video={{ ...video, title: video.title || 'Video lesson' }}
                onClose={() => navigate(`/learn/${lang}`)}
              />
            </div>

            {/* Recommended videos under the player */}
            <div className="order-3 min-w-0">
              <VideoPanel
                language={lang}
                compact
                title="Recommended videos"
                onSelect={playVideo}
                activeId={video.youtubeId}
              />
            </div>
          </div>

          {/* Editor + terminal on the right */}
          <div className="order-2 min-w-0 lg:sticky lg:top-5">
            <CodeEditor language={lang} editorHeight="440px" />
          </div>
        </div>

        {/* Quiz link at the very bottom */}
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center dark:border-stone-800">
          <p className="text-sm text-stone-600 dark:text-stone-400">Finished watching? Test your {langName} knowledge.</p>
          <Link
            to={`/quiz/${lang}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-stone-900 px-5 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            Take the quiz
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}