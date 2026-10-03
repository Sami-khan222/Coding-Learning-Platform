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
          >
            {loading ? 'Checking…' : 'Verify'}
          </button>
        </form>

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
      </div>
    </div>
  )
}