import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

// Same logos as the home page language cards (emojis and per-language colors removed)
const LANG_META = {
  python:     { name: 'Python',     logo: `${DEVICON}/python/python-original.svg` },
  javascript: { name: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg` },
  java:       { name: 'Java',       logo: `${DEVICON}/java/java-original.svg` },
  cpp:        { name: 'C++',        logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
}

const BTN_PRIMARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
const BTN_SECONDARY =
  'inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-stone-300 px-5 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

/* ── Small pieces (same as home page) ───────────────────── */

function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Eyebrow({ children }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
      {children}
    </p>
  )
}

/* ── Icons ──────────────────────────────────────────────── */

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
)
const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
)
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
)

/* ── Shared shell for centered states ───────────────────── */

function CenteredShell({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fcfbf8] px-6 py-12 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function CertPage() {
  const { id }       = useParams()
  const certRef      = useRef(null)
  const [cert,        setCert]        = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [downloading, setDownloading] = useState(false)
  const [copied,      setCopied]      = useState(false)

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res  = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/certificate/${id}`)
        const data = await res.json().catch(() => ({}))
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
        backgroundColor: '#fbf9f4',
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

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Could not copy the link.')
    }
  }

<<<<<<< HEAD
  // ── Loading ──
=======
  /* ── Loading ──────────────────────────────────────── */
>>>>>>> c69f5b2 (New UI Changes)
  if (loading) return (
    <CenteredShell>
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <span aria-hidden className="absolute inset-0 rounded-full border-2 border-stone-200 dark:border-stone-800" />
          <span
            aria-hidden
            className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-stone-900 dark:border-t-stone-100"
            style={{ animationDuration: '1.1s' }}
          />
        </span>
        <div>
          <Eyebrow>Certificate</Eyebrow>
          <p className="mt-2 font-serif text-2xl tracking-tight text-stone-900 dark:text-stone-50">
            Verifying your achievement…
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Loading your certificate.</p>
        </div>
      </div>
    </CenteredShell>
  )

<<<<<<< HEAD
  // ── Error ──
=======
  /* ── Error ────────────────────────────────────────── */
>>>>>>> c69f5b2 (New UI Changes)
  if (error) return (
    <CenteredShell>
      <Eyebrow>Verification failed</Eyebrow>
      <h1 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        Certificate not found.
      </h1>
      <div
        role="alert"
        className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-relaxed text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400"
      >
        {error}
      </div>
      <Link to="/" className={`${BTN_SECONDARY} mt-8`}>
        <ArrowLeftIcon />
        Back to home
      </Link>
    </CenteredShell>
  )

<<<<<<< HEAD
  const meta = LANG_META[cert.language] || { name: cert.language, emoji: '💻', color: '#6366f1', gradient: 'from-indigo-500 to-purple-500' }
  const verifyUrl = `${window.location.origin}/verify/${cert.uniqueId}`
=======
  const meta = LANG_META[cert.language] || { name: cert.language }
>>>>>>> c69f5b2 (New UI Changes)

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fcfbf8] py-8 text-stone-900 antialiased sm:py-12 dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

<<<<<<< HEAD
        {/* Action buttons above cert */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 animate-fade-in-up">
          <Link to="/" className="group text-sm text-gray-500 hover:text-gray-300 transition-all duration-300 flex items-center gap-1 hover:gap-2">
            <span>←</span>
            <span>Back to Dashboard</span>
=======
        {/* ══════════ Page header ══════════ */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
          >
            <ArrowLeftIcon />
            Back to dashboard
>>>>>>> c69f5b2 (New UI Changes)
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={copyLink} className={BTN_SECONDARY}>
              <LinkIcon />
              {copied ? 'Link copied' : 'Share'}
            </button>
            <button onClick={downloadPNG} disabled={downloading} className={BTN_PRIMARY}>
              {downloading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                  Processing…
                </>
              ) : (
                <>
                  <DownloadIcon />
                  Download PNG
                </>
              )}
            </button>
          </div>
        </div>

<<<<<<< HEAD
        {/* ── Certificate Card (this gets captured by html2canvas) ── */}
=======
        {/* ══════════ Certificate (captured by html2canvas) ══════════
            Light colors are inline hex on purpose: the downloaded PNG
            should look the same in light and dark mode, and html2canvas
            can fail on some Tailwind color formats. */}
>>>>>>> c69f5b2 (New UI Changes)
        <div
          ref={certRef}
          className="rounded-xl p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]"
          style={{ background: '#fbf9f4', border: '1px solid #e7e5e4' }}
        >
<<<<<<< HEAD
          {/* Background glows */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 opacity-10 animate-pulse"
              style={{ background: `radial-gradient(circle at top left, ${meta.color}, transparent)` }} />
            <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10 animate-pulse delay-1000"
              style={{ background: `radial-gradient(circle at bottom right, ${meta.color}, transparent)` }} />
          </div>

          {/* Top ribbon */}
          <div className="absolute top-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, ${meta.color}, transparent)` }} />

          <div className="relative z-10 text-center">

            {/* Header icon */}
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

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black mb-3 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
=======
          <div
            className="rounded-lg px-6 py-12 text-center sm:px-16 sm:py-16"
            style={{ border: '1px solid #d6d3d1' }}
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.25em]" style={{ color: '#78716c' }}>
              CodeLearn
            </p>
            <p className="mt-5 font-serif text-3xl sm:text-5xl" style={{ color: '#1c1917' }}>
>>>>>>> c69f5b2 (New UI Changes)
              Certificate of Completion
            </p>

<<<<<<< HEAD
            {/* Name */}
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

            {/* Language badge */}
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

            {/* Score */}
            <div className="flex items-center justify-center gap-3 mb-10 sm:mb-12">
              <span className="text-gray-500 text-sm">Final Score</span>
              <div className="relative">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  {cert.score}%
=======
            <p className="mt-8 text-sm" style={{ color: '#78716c' }}>This certifies that</p>
            <p
              className="mx-auto mt-3 max-w-xl pb-3 font-serif text-3xl italic sm:text-4xl"
              style={{ color: '#292524', borderBottom: '1px solid #d6d3d1' }}
            >
              {cert.userName}
            </p>

            <p className="mt-8 text-sm" style={{ color: '#78716c' }}>has successfully completed the</p>

            <div className="mt-4 inline-flex items-center gap-3">
              {meta.logo && <img src={meta.logo} alt="" crossOrigin="anonymous" className="h-9 w-9" />}
              <span className="font-serif text-2xl sm:text-3xl" style={{ color: '#1c1917' }}>
                {meta.name}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em]" style={{ color: '#a8a29e' }}>
              Programming course
            </p>

            <p className="mt-8 text-sm leading-relaxed" style={{ color: '#78716c' }}>
              with a final score of{' '}
              <span className="font-semibold" style={{ color: '#292524' }}>{cert.score}%</span>
            </p>

            <div className="mx-auto mt-10 grid max-w-xl grid-cols-1 gap-4 pt-6 sm:grid-cols-3" style={{ borderTop: '1px solid #d6d3d1' }}>
              {[
                { label: 'Issued on', value: formatDate(cert.issuedAt) },
                { label: 'Platform', value: 'CodeLearn' },
                { label: 'Certificate ID', value: `${id.slice(0, 13)}…`, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label}>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: '#a8a29e' }}>
                    {label}
                  </p>
                  <p
                    className={`mt-1 truncate text-xs ${mono ? 'font-mono' : 'font-medium'}`}
                    style={{ color: '#44403c' }}
                  >
                    {value}
                  </p>
>>>>>>> c69f5b2 (New UI Changes)
                </div>
              ))}
            </div>
<<<<<<< HEAD

            {/* Decorative divider */}
            <div className="flex items-center gap-4 mb-8 sm:mb-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-700 to-transparent" />
              <span className="text-indigo-600 text-base sm:text-lg">✦</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-700 to-transparent" />
            </div>

            {/* Footer info */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-2">📅 Issued On</div>
                <p className="text-gray-300 text-xs sm:text-sm font-semibold">{formatDate(cert.issuedAt)}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-2">🏆 Platform</div>
                <p className="text-gray-300 text-xs sm:text-sm font-semibold">CodeLearn</p>
              </div>
            </div>

            {/* ID + QR row */}
            <div className="mt-3 sm:mt-4 flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-xl p-3 text-left">
              <div className="bg-white p-1.5 rounded-lg shrink-0">
                <QRCodeSVG value={verifyUrl} size={72} />
              </div>
              <div className="min-w-0">
                <div className="text-gray-600 text-xs uppercase tracking-wider mb-1">🔑 Certificate ID</div>
                <p className="text-gray-300 text-[11px] sm:text-xs font-mono break-all">{cert.uniqueId}</p>
                <p className="text-gray-500 text-[10px] mt-1.5 break-all">Verify at: {verifyUrl}</p>
              </div>
            </div>

          </div>{/* end relative z-10 text-center */}

          {/* Bottom ribbon */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5"
            style={{ background: `linear-gradient(90deg, transparent, ${meta.color}, ${meta.color}, transparent)` }} />
        </div>{/* end certificate card */}

        {/* Verification note */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-800 max-w-full">
            <span className="text-xs text-gray-500">🔐 Verification ID:</span>
            <span className="text-xs font-mono text-gray-400 break-all">{id}</span>
          </div>
          <div className="mt-3">
            <Link to={`/verify/${id}`} className="text-xs text-indigo-400 hover:underline">
              Verify this certificate →
            </Link>
          </div>
        </div>

        {/* Next steps */}
        <div className="mt-8 sm:mt-12">
          <h3 className="text-center text-gray-400 text-sm font-semibold mb-4">Continue Your Journey</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
=======
          </div>
        </div>

        {/* ══════════ Verification line ══════════ */}
        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-stone-700 dark:text-stone-300">Verified</span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="font-mono">{id.slice(0, 20)}…</span>
        </div>

        {/* ══════════ Continue learning ══════════ */}
        <div className="mt-16 sm:mt-20">
          <Eyebrow>Next up</Eyebrow>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
            Continue your journey
          </h2>

          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 sm:grid-cols-3 dark:border-stone-800 dark:bg-stone-800">
>>>>>>> c69f5b2 (New UI Changes)
            {['python', 'javascript', 'java', 'cpp']
              .filter(l => l !== cert.language)
              .slice(0, 3)
              .map(l => (
                <Link
                  key={l}
                  to={`/learn/${l}`}
                  className="group flex flex-col bg-white p-6 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
                >
                  <img src={LANG_META[l].logo} alt={`${LANG_META[l].name} logo`} className="h-8 w-8" loading="lazy" />
                  <h3 className="mt-5 text-base font-semibold text-stone-900 dark:text-white">
                    Learn {LANG_META[l].name}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 dark:text-stone-100">
                    Start {LANG_META[l].name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
          </div>
        </div>

      </div>
    </div>
  )
}