<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

export default function VerifyPage() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()
  const [input, setInput] = useState(urlId || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const verify = async (id) => {
    if (!id.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/certificate/verify/${encodeURIComponent(id.trim())}`)
      setResult(await res.json())
    } catch {
      setResult({ valid: false, message: 'Something went wrong. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Auto-verify when opened via link or QR code: /verify/<id>
  useEffect(() => {
    if (urlId) verify(urlId)
  }, [urlId])

  const onSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) navigate(`/verify/${encodeURIComponent(input.trim())}`)
  }

  return (
    <div className="min-h-screen bg-white px-6 py-24 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Verify a certificate</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Enter the certificate ID printed on the certificate.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Certificate ID"
            className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 font-mono text-sm outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-gray-900 px-6 text-sm font-semibold text-white disabled:opacity-50 dark:bg-white dark:text-gray-900"
=======
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const API = 'https://coding-learning-platform-4okh.onrender.com/api'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const CheckCircle = () => (
  <svg {...iconProps} className="h-5 w-5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.8 2.8L16 9.5" />
  </svg>
)
const CrossCircle = () => (
  <svg {...iconProps} className="h-5 w-5 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </svg>
)

function formatDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Row({ label, children, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className={`text-right text-sm text-stone-900 dark:text-stone-100 ${mono ? 'break-all font-mono text-xs' : 'font-medium'}`}>
        {children}
      </dd>
    </div>
  )
}

export default function VerifyPage() {
  const { id: urlId } = useParams()
  const navigate = useNavigate()

  const [input, setInput] = useState(urlId || '')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const ctrlRef = useRef(null)

  const verify = useCallback(async (rawId) => {
    const id = rawId.trim()
    if (!id) return

    ctrlRef.current?.abort()
    const ctrl = new AbortController()
    ctrlRef.current = ctrl

    setLoading(true)
    setResult(null)
    try {
      const res = await fetch(`${API}/certificate/verify/${encodeURIComponent(id)}`, { signal: ctrl.signal })
      let data = null
      try {
        data = await res.json()
      } catch {}

      if (!data) {
        setResult({ valid: false, message: `The server returned an unexpected response (${res.status}). Please try again.` })
      } else {
        setResult(data)
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setResult({ valid: false, message: "We couldn't reach the server. Please try again in a moment." })
    } finally {
      if (!ctrl.signal.aborted) setLoading(false)
    }
  }, [])

  // Opened via link or QR code: /verify/<id>
  useEffect(() => {
    if (urlId) {
      setInput(urlId)
      verify(urlId)
    } else {
      setResult(null)
    }
    return () => ctrlRef.current?.abort()
  }, [urlId, verify])

  const onSubmit = (e) => {
    e.preventDefault()
    const id = input.trim()
    if (!id) return
    // Same ID as the current URL: navigating would be a no-op, so re-check directly
    if (id === urlId) verify(id)
    else navigate(`/verify/${encodeURIComponent(id)}`)
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#fcfbf8] px-6 py-20 sm:px-10 sm:py-28 dark:bg-stone-950">
      <div className="mx-auto max-w-lg">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
          Certificates
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Verify a certificate
        </h1>
        <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
          Enter the ID printed at the bottom of the certificate to confirm it was issued by CodeLearn.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="cert-id" className="sr-only">
            Certificate ID
          </label>
          <input
            id="cert-id"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. CL-8F3A-21C9"
            autoComplete="off"
            spellCheck={false}
            className="h-12 flex-1 rounded-lg border border-stone-300 bg-white px-4 font-mono text-sm text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-stone-300"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
>>>>>>> c69f5b2 (New UI Changes)
          >
            {loading ? 'Checking…' : 'Verify'}
          </button>
        </form>

<<<<<<< HEAD
        {result?.valid && (
          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-left dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">✅ Valid certificate</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Name</dt><dd className="font-medium">{result.userName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Course</dt><dd className="font-medium">{result.languageName}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Score</dt><dd className="font-medium">{result.score}%</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Issued</dt><dd className="font-medium">{new Date(result.issuedAt).toLocaleDateString()}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">ID</dt><dd className="font-mono text-xs">{result.uniqueId}</dd></div>
            </dl>
          </div>
        )}

        {result && !result.valid && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            ❌ {result.message}
          </div>
        )}

        <Link to="/" className="mt-10 inline-block text-sm text-gray-500 hover:underline">← Back home</Link>
=======
        <div aria-live="polite" className="mt-8">
          {result?.valid && (
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center gap-2.5 border-b border-stone-200 bg-emerald-50 px-5 py-3.5 text-emerald-800 dark:border-stone-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                <CheckCircle />
                <p className="text-sm font-semibold">Valid certificate</p>
              </div>
              <dl className="divide-y divide-stone-100 px-5 dark:divide-stone-800">
                <Row label="Name">{result.userName}</Row>
                <Row label="Course">{result.languageName}</Row>
                <Row label="Score">{result.score}%</Row>
                <Row label="Issued">{formatDate(result.issuedAt)}</Row>
                <Row label="Certificate ID" mono>
                  {result.uniqueId}
                </Row>
              </dl>
            </div>
          )}

          {result && !result.valid && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <CrossCircle />
              <div>
                <p className="font-semibold">Not verified</p>
                <p className="mt-1 leading-relaxed">{result.message || 'No certificate matches that ID.'}</p>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/"
          className="mt-12 inline-block text-sm text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline dark:hover:text-stone-100"
        >
          Back to home
        </Link>
>>>>>>> c69f5b2 (New UI Changes)
      </div>
    </div>
  )
}