import { useState, useEffect } from 'react'

// Enhanced Topic display labels with icons
const TOPIC_LABELS = {
  basics:      '📘 Basics',
  functions:   '⚡ Functions',
  oop:         '🏗️ OOP',
  dom:         '🌐 DOM',
  async:       '⏳ Async',
  es6:         '✨ ES6+',
  collections: '📦 Collections',
  pointers:    '🎯 Pointers',
  stl:         '🔧 STL',
}

const LEVEL_STYLES = {
  Beginner:     'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30',
  Intermediate: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30',
  Advanced:     'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border border-red-500/30',
}

// ── Enhanced Skeleton loader card ──
function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-900/50 border border-gray-800 animate-pulse">
      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-800 rounded-lg w-full" />
        <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
        <div className="flex justify-between mt-3">
          <div className="h-3 bg-gray-800 rounded-lg w-1/3" />
          <div className="h-3 bg-gray-800 rounded-lg w-1/4" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
    </div>
  )
}

// ── Enhanced Close icon ──
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ── Main VideoPanel with enhanced UI ──
export default function VideoPanel({ language = 'python' }) {
  const [topics,       setTopics]       = useState([])
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [videos,       setVideos]       = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState('')
  const [modalVideo,   setModalVideo]   = useState(null)
  const [imgErrors,    setImgErrors]    = useState({})
  const [source,       setSource]       = useState('')   // 'youtube' | 'fallback'

  // Fetch topic list when language changes
  useEffect(() => {
    setSelectedTopic('all')
    setVideos([])
    setTopics([])
    setImgErrors({})

    const fetchTopics = async () => {
      try {
        const res  = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/videos/${language}/topics`)
        const data = await res.json()
        if (res.ok) setTopics(data.topics || [])
      } catch {
        // Topics list failed — non-critical, pills just won't show
      }
    }
    fetchTopics()
  }, [language])

  // Fetch videos when language or topic changes
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      setError('')

      try {
        const topicParam = selectedTopic !== 'all' ? `?topic=${selectedTopic}` : ''
        const res  = await fetch(`/api/videos/${language}${topicParam}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Failed to load videos')

        setVideos(data.videos || [])
        setSource(data.source || '')
      } catch (err) {
        setError(err.message)
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [language, selectedTopic])

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setModalVideo(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = modalVideo ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalVideo])

  const handleImgError = (youtubeId) =>
    setImgErrors(prev => ({ ...prev, [youtubeId]: true }))

  return (
    <div className="flex flex-col gap-5 animate-fade-in">

      {/* ── Enhanced Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-base shadow-lg">
            📹
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-200 flex items-center gap-2">
              Video Lessons
              {!loading && (
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                  {videos.length} video{videos.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>
        </div>
        
        {/* Enhanced Source badge */}
        {source === 'youtube' && (
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <span className="relative flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              🔴 Live YouTube
            </span>
          </div>
        )}
        {source === 'fallback' && (
          <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-700 text-gray-400 font-medium backdrop-blur-sm">
            📁 Curated Library
          </span>
        )}
      </div>

      {/* ── Enhanced Topic Filter Pills ── */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 animate-slide-down">
          {/* All topics pill */}
          <button
            onClick={() => setSelectedTopic('all')}
            className={`group relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105
              ${selectedTopic === 'all'
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
              }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>🎯</span>
              <span>All Topics</span>
            </span>
            {selectedTopic === 'all' && (
              <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 rounded-full blur-md opacity-50"></div>
            )}
          </button>

          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`group relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105
                ${selectedTopic === topic
                  ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-gray-700'
                }`}
            >
              <span className="relative z-10">{TOPIC_LABELS[topic] || topic}</span>
              {selectedTopic === topic && (
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 rounded-full blur-md opacity-50"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Loading Skeletons with improved animation ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* ── Enhanced Error ── */}
      {!loading && error && (
        <div className="text-center py-12 px-4 animate-shake">
          <div className="relative inline-block mb-4">
            <div className="text-5xl">⚠️</div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 py-3 max-w-md mx-auto">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setSelectedTopic(selectedTopic)}
            className="mt-4 px-4 py-2 rounded-lg text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-105"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* ── Enhanced No videos found ── */}
      {!loading && !error && videos.length === 0 && (
        <div className="text-center py-16 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <div className="text-6xl">📭</div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gray-700 rounded-full"></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">No videos found for this topic</p>
          <button
            onClick={() => setSelectedTopic('all')}
            className="mt-4 text-xs text-brand-400 hover:text-brand-300 transition-all duration-300 inline-flex items-center gap-1 group"
          >
            <span>Show all videos</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      )}

      {/* ── Enhanced Video Cards Grid ── */}
      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {videos.map((video, index) => (
            <button
              key={video.youtubeId}
              onClick={() => setModalVideo(video)}
              className="group relative text-left rounded-xl overflow-hidden border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-brand-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 aspect-video">
                {!imgErrors[video.youtubeId] ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={() => handleImgError(video.youtubeId)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <span className="text-6xl opacity-20">📹</span>
                  </div>
                )}

                {/* Enhanced Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Enhanced Level badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm ${LEVEL_STYLES[video.level] || LEVEL_STYLES.Beginner}`}>
                    {video.level}
                  </span>
                </div>

                {/* Duration badge (placeholder for future enhancement) */}
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-gray-300 font-mono">
                    10:23
                  </span>
                </div>
              </div>

              {/* Enhanced Card info */}
              <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-900/50">
                <p className="text-sm font-semibold text-gray-200 leading-snug line-clamp-2 group-hover:text-brand-400 transition-colors duration-300">
                  {video.title}
                </p>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">📺</span>
                    <span className="text-xs text-gray-400 truncate">{video.channel}</span>
                  </div>
                  {video.topic && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 backdrop-blur-sm text-gray-400 whitespace-nowrap shrink-0 border border-gray-700">
                      {TOPIC_LABELS[video.topic] || video.topic}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-500/0 via-transparent to-brand-500/0 group-hover:from-brand-500/5 group-hover:to-brand-500/5 transition-all duration-300 pointer-events-none"></div>
            </button>
          ))}
        </div>
      )}

      {/* ── Enhanced Video Modal ── */}
      {modalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setModalVideo(null) }}
        >
          <div className="relative w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 animate-scale-up">

            {/* Enhanced Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
              <div className="pr-8 min-w-0">
                <h3 className="text-white font-bold text-base leading-snug line-clamp-2">
                  {modalVideo.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-500 text-xs">📺</span>
                    <p className="text-gray-400 text-xs">{modalVideo.channel}</p>
                  </div>
                  {modalVideo.level && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_STYLES[modalVideo.level]}`}>
                      {modalVideo.level}
                    </span>
                  )}
                  {modalVideo.topic && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                      {TOPIC_LABELS[modalVideo.topic] || modalVideo.topic}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setModalVideo(null)}
                className="group shrink-0 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110"
                aria-label="Close video"
              >
                <CloseIcon />
              </button>
            </div>

            {/* YouTube embed with loading state */}
            <div className="aspect-video bg-black relative">
              <iframe
                src={`https://www.youtube.com/embed/${modalVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
                title={modalVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Enhanced Modal footer */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-900/50 border-t border-gray-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">💡 Pro tip:</span>
                <span className="text-xs text-gray-400">Use keyboard shortcuts for faster learning</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${modalVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-all duration-300 hover:gap-2"
              >
                <span>Open in YouTube</span>
                <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Add these to your global CSS:
/*
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

.animate-scale-up {
  animation: scale-up 0.3s ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
*/