import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same gutters as the home page
const PAD = 'px-6 sm:px-10 lg:px-16 xl:px-20'

const INPUT =
  'h-11 w-full rounded-lg border border-stone-300 bg-white text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:focus:border-stone-300'

/* ── Small pieces (same as home page) ───────────────────── */

function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden>
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

function WindowFrame({ title, children, className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-stone-800 dark:bg-stone-900 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-stone-200 bg-stone-50 px-4 py-2.5 dark:border-stone-800 dark:bg-stone-900">
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-700" />
        <span className="ml-3 font-mono text-xs text-stone-500">{title}</span>
      </div>
      {children}
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────── */

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
)
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)
const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
)

/* ── Side mockup (mirrors the home page editor mock) ────── */

function SessionMock() {
  return (
    <WindowFrame title="progress.py">
      <div className="grid grid-cols-[2.5rem_1fr] font-mono text-[13px] leading-6">
        <div className="select-none border-r border-stone-100 py-4 pr-3 text-right text-stone-400 dark:border-stone-800 dark:text-stone-600">
          {[1, 2, 3, 4].map(n => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <pre className="overflow-x-auto py-4 pl-4 pr-4 text-stone-800 dark:text-stone-200">
          <code>
            <span className="text-indigo-600 dark:text-indigo-400">def</span>{' '}
            <span className="text-amber-700 dark:text-amber-400">welcome_back</span>(you):{'\n'}
            {'    '}
            <span className="text-indigo-600 dark:text-indigo-400">return</span>{' '}
            <span className="text-emerald-700 dark:text-emerald-400">"Pick up where you left off"</span>
            {'\n\n'}
            <span className="text-stone-400"># Your progress is saved</span>
          </code>
        </pre>
      </div>
      <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 font-mono text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-950/50 dark:text-stone-400">
        <span className="text-stone-400">$ </span>Pick up where you left off
      </div>
    </WindowFrame>
  )
}

/* ── Page ───────────────────────────────────────────────── */

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('https://coding-learning-platform-4okh.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || `Login failed (HTTP ${res.status})`)
      login(data.token, data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fcfbf8] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      <div
        className={`mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-14 ${PAD} py-12 sm:py-16 lg:grid-cols-[1fr_1fr] lg:gap-24`}
      >
        {/* ───────── Form column ───────── */}
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <Eyebrow>Sign in</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
            Welcome back.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
            Sign in to continue where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-9 space-y-5">
            {/* Error banner */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400"
              >
                <span className="mt-0.5 flex-shrink-0">
                  <AlertIcon />
                </span>
                <span className="min-w-0 flex-1 leading-relaxed">{error}</span>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="flex-shrink-0 rounded-md p-0.5 text-rose-500 transition-colors hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                  aria-label="Dismiss error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-stone-800 dark:text-stone-200">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`${INPUT} pl-9 pr-3`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="block text-sm font-medium text-stone-800 dark:text-stone-200">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-stone-500 underline-offset-4 transition-colors hover:text-stone-900 hover:underline dark:text-stone-400 dark:hover:text-stone-200"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500">
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${INPUT} pl-9 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-600 dark:text-stone-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-stone-900 underline underline-offset-4 hover:text-indigo-600 dark:text-stone-100 dark:hover:text-indigo-400"
            >
              Create a free account
            </Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 border-t border-stone-200 pt-5 dark:border-stone-800">
            <p className="text-xs text-stone-500">Demo account</p>
            <code className="mt-1 block font-mono text-xs text-stone-700 dark:text-stone-300">
              demo@example.com / password123
            </code>
          </div>
        </div>

        {/* ───────── Visual column ───────── */}
        <div className="hidden lg:block">
          <div className="relative">
            <SessionMock />
            <ul className="mt-10 space-y-2.5">
              {['Your progress is saved per language', 'Pick up your last video lesson', 'Download certificates any time'].map(p => (
                <li key={p} className="flex items-start gap-3 text-sm text-stone-700 dark:text-stone-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}