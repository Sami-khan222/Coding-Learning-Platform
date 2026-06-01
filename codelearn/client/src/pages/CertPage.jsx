import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'

const LANG_META = {
  python:     { name: 'Python',     emoji: '🐍', color: '#10b981', gradient: 'from-emerald-500 to-teal-500' },
  javascript: { name: 'JavaScript', emoji: '⚡', color: '#f59e0b', gradient: 'from-amber-500 to-yellow-500' },
  java:       { name: 'Java',       emoji: '☕', color: '#f97316', gradient: 'from-orange-500 to-red-500' },
  cpp:        { name: 'C++',        emoji: '⚙️', color: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function CertPage() {
  const { id }       = useParams()
  const certRef      = useRef(null)
  const [cert,       setCert]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res  = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/certificate/${id}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Certificate not found')
        setCert(data.certificate)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCert()
  }, [id])

  const downloadPNG = async () => {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0f172a',
        logging: false,
        windowWidth: certRef.current.scrollWidth,
        windowHeight: certRef.current.scrollHeight,
      })
      const link = document.createElement('a')
      link.download = `codelearn-certificate-${cert.language}-${id.slice(0, 8)}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed. Try right-clicking the certificate and saving as image.')
    } finally {
      setDownloading(false)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Certificate link copied to clipboard!')
  }

  // ── Enhanced Loading ──
  if (loading) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300 mx-auto"></div>
        </div>
        <p className="text-gray-400 font-medium mt-4">Verifying your achievement...</p>
        <p className="text-gray-600 text-sm mt-1">Please wait while we load your certificate</p>
      </div>
    </div>
  )

  // ── Enhanced Error ──
  if (error) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="relative inline-block mb-6">
          <div className="text-7xl animate-bounce">🔍</div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
          Certificate Not Found
        </h2>
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
        <Link to="/" className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold transition-all duration-300 hover:scale-105">
          <span>←</span>
          <span>Go Home</span>
        </Link>
      </div>
    </div>
  )

  const meta = LANG_META[cert.language] || { name: cert.language, emoji: '💻', color: '#6366f1', gradient: 'from-indigo-500 to-purple-500' }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Enhanced Action buttons above cert */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 animate-fade-in-up">
          <Link to="/" className="group text-sm text-gray-500 hover:text-gray-300 transition-all duration-300 flex items-center gap-1 hover:gap-2">
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={copyLink}
              className="group relative px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold text-gray-300 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-brand-500 hover:text-white transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🔗</span>
              <span>Share</span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button
              onClick={downloadPNG}
              disabled={downloading}
              className="group relative px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 overflow-hidden"
            >
              {downloading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="group-hover:-translate-y-0.5 transition-transform">⬇️</span>
                  <span>Download PNG</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Enhanced Certificate Card (this gets captured by html2canvas) ── */}
        <div
          ref={certRef}
          className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
          style={{
            background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)`,
            border: `2px solid ${meta.color}44`,
            padding: '32px 40px',
          }}
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 opacity-10 animate-pulse"
              style={{ background: `radial-gradient(circle at top left, ${meta.color}, transparent)` }} />
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 animate-pulse delay-1000"
              style={{ background: `radial-gradient(circle at bottom right, ${meta.color}, transparent)` }} />
          </div>

          {/* Top ribbon with gradient animation */}
          <div className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, ${meta.color}, transparent)` }} />

          <div className="relative z-10 text-center">

            {/* Header with animated icon */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-indigo-500" />
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">🎓</span>
                </div>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-indigo-500" />
            </div>

            {/* Title with gradient */}
            <h1 className="text-2xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
              Certificate of Completion
            </h1>
            <p className="text-indigo-300 text-xs sm:text-sm tracking-widest uppercase mb-8 sm:mb-12">
              This certifies that
            </p>

            {/* Name with calligraphy style */}
            <div className="mb-4">
              <p className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" style={{ fontFamily: 'Georgia, serif' }}>
                {cert.userName}
              </p>
            </div>
            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto mb-8 sm:mb-10" />

            {/* Body text */}
            <p className="text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
              has successfully completed the
            </p>

            {/* Enhanced Language badge */}
            <div className="inline-flex items-center gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl mb-8 sm:mb-10 backdrop-blur-sm transform hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${meta.color}22, ${meta.color}11)`,
                border: `1px solid ${meta.color}66`,
                boxShadow: `0 0 20px ${meta.color}22`,
              }}>
              <div className="text-4xl sm:text-5xl animate-float">{meta.emoji}</div>
              <div className="text-left">
                <p className="text-white text-xl sm:text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {meta.name}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">Programming Course</p>
              </div>
            </div>

            {/* Score with progress ring effect */}
            <div className="flex items-center justify-center gap-3 mb-10 sm:mb-12">
              <span className="text-gray-500 text-sm">Final Score</span>
              <div className="relative">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {cert.score}%
                </div>
                {cert.score === 100 && (
                  <div className="absolute -top-2 -right-4 text-lg animate-bounce">🌟</div>
                )}
              </div>
            </div>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-700 to-transparent" />
              <span className="text-indigo-600 text-base sm:text-lg">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-700 to-transparent" />
            </div>

            {/* Enhanced Footer info with icons */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-2">📅 Issued On</div>
                <p className="text-gray-300 text-xs sm:text-sm font-semibold">{formatDate(cert.issuedAt)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-2">🏆 Platform</div>
                <p className="text-gray-300 text-xs sm:text-sm font-semibold">CodeLearn</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-2">🔑 Certificate ID</div>
                <p className="text-gray-400 text-[10px] sm:text-xs font-mono">{id.slice(0, 13)}...</p>
              </div>
            </div>

          </div>

          {/* Bottom ribbon */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, ${meta.color}, transparent)` }} />
        </div>

        {/* Enhanced Verification note */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-gray-800">
            <span className="text-xs text-gray-500">🔐 Verification ID:</span>
            <span className="text-xs font-mono text-gray-400">{id}</span>
          </div>
        </div>

        {/* Enhanced Next steps */}
        <div className="mt-8 sm:mt-12">
          <h3 className="text-center text-gray-400 text-sm font-semibold mb-4">Continue Your Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {['python', 'javascript', 'java', 'cpp']
              .filter(l => l !== cert.language)
              .slice(0, 3)
              .map(l => (
                <Link
                  key={l}
                  to={`/learn/${l}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4 text-center hover:border-brand-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{LANG_META[l].emoji}</div>
                    <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                      Learn {LANG_META[l].name}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}

// Add these animations to your global CSS or Tailwind config:
/*
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
*/