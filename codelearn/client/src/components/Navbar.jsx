import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const LANGUAGES = [
  { label: 'Python', lang: 'python', logo: `${DEVICON}/python/python-original.svg` },
  { label: 'JavaScript', lang: 'javascript', logo: `${DEVICON}/javascript/javascript-original.svg` },
  { label: 'Java', lang: 'java', logo: `${DEVICON}/java/java-original.svg` },
  { label: 'C++', lang: 'cpp', logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
]

/* ───────────── Icons ───────────── */

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const SunIcon = () => (
  <svg {...iconProps} className="h-[18px] w-[18px]">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.06 1.06M17.34 17.34l1.06 1.06M5.6 18.4l1.06-1.06M17.34 6.66l1.06-1.06" />
  </svg>
)

const MoonIcon = () => (
  <svg {...iconProps} className="h-[18px] w-[18px]">
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
  </svg>
)

const MenuIcon = () => (
  <svg {...iconProps} className="h-5 w-5">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

const CloseIcon = () => (
  <svg {...iconProps} className="h-5 w-5">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

const ChevronDown = ({ open }) => (
  <svg {...iconProps} className={`h-4 w-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const SparkleIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7-5.6-1.9L10.1 9 12 3.5Z" />
    <path d="M19 3v3M20.5 4.5h-3" />
  </svg>
)

/* ───────────── Logo ───────────── */

function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <rect width="36" height="36" rx="9" className="fill-stone-900 dark:fill-stone-100" />
      {/* prompt chevron */}
      <path
        d="m11 12.5 6.5 5.5-6.5 5.5"
        fill="none"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-white dark:stroke-stone-900"
      />
      {/* cursor */}
      <path d="M20.5 24h6" strokeWidth="2.8" strokeLinecap="round" className="stroke-indigo-400 dark:stroke-indigo-600" />
    </svg>
  )
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="CodeLearn home">
      <LogoMark />
      <span className="font-serif text-xl tracking-tight text-stone-900 dark:text-stone-50">CodeLearn</span>
    </Link>
  )
}

function ThemeButton({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-900 dark:hover:text-stone-100"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}

/* ───────────── Navbar ───────────── */

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [dark, setDark] = useState(() => {
  try {
    return localStorage.getItem('cl_theme') !== 'light'
  } catch {
    return true
  }
})
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const userRef = useRef(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    try {
      localStorage.setItem('cl_theme', dark ? 'dark' : 'light')
    } catch {}
  }, [dark])

  useEffect(() => {
    setMenuOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!userOpen) return
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setUserOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [userOpen])

  const handleLogout = () => {
    setUserOpen(false)
    logout()
    navigate('/')
  }

  const toggleTheme = () => setDark((d) => !d)
  const isActive = (path) => location.pathname === path
  const initial = user?.name?.charAt(0).toUpperCase() || 'U'
  const chatActive = isActive('/chat')

  const linkBase = 'relative flex h-16 items-center gap-2 px-3 text-sm font-medium transition-colors'
  const linkIdle = 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
  const linkActive = 'text-stone-900 dark:text-stone-50'
  
  if (location.pathname.startsWith('/watch')) return null

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#fcfbf8] dark:border-stone-800 dark:bg-stone-950">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop: language links only */}
        <div className="hidden items-center md:flex">
          {LANGUAGES.map(({ label, lang, logo }) => {
            const path = `/learn/${lang}`
            const active = isActive(path)
            return (
              <Link key={lang} to={path} className={`${linkBase} ${active ? linkActive : linkIdle}`}>
                <img src={logo} alt="" className="h-4 w-4" loading="lazy" />
                {label}
                {active && (
                  <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop: right side */}
        <div className="hidden items-center gap-2 md:flex">
          {/* AI tutor: separate, button-style link */}
          <Link
            to="/chat"
            aria-current={chatActive ? 'page' : undefined}
            className={`inline-flex h-9 items-center gap-2 rounded-md border px-3.5 text-sm font-medium transition-colors ${
              chatActive
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-300'
                : 'border-stone-300 text-stone-800 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900'
            }`}
          >
            <SparkleIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            AI tutor
          </Link>

          <span aria-hidden className="mx-1 h-5 w-px bg-stone-200 dark:bg-stone-800" />

          <ThemeButton dark={dark} onToggle={toggleTheme} />

          {isAuth ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2 transition-colors hover:bg-stone-100 dark:hover:bg-stone-900"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                  {initial}
                </span>
                <span className="max-w-[100px] truncate text-sm font-medium text-stone-700 dark:text-stone-200">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown open={userOpen} />
              </button>

              {userOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] dark:border-stone-800 dark:bg-stone-900"
                >
                  <div className="border-b border-stone-100 px-4 py-3 dark:border-stone-800">
                    <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-50">{user?.name}</p>
                    <p className="mt-0.5 truncate text-xs text-stone-500">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full rounded-md px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex h-9 items-center rounded-md bg-stone-900 px-4 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeButton dark={dark} onToggle={toggleTheme} />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-stone-200 bg-[#fcfbf8] md:hidden dark:border-stone-800 dark:bg-stone-950">
          <div className="space-y-6 px-4 py-5 sm:px-6">
            {/* Languages */}
            <div>
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Learn</p>
              <div className="space-y-0.5">
                {LANGUAGES.map(({ label, lang, logo }) => {
                  const active = isActive(`/learn/${lang}`)
                  return (
                    <Link
                      key={lang}
                      to={`/learn/${lang}`}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-stone-100 text-stone-900 dark:bg-stone-900 dark:text-stone-50'
                          : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900'
                      }`}
                    >
                      <img src={logo} alt="" className="h-5 w-5" loading="lazy" />
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* AI tutor: its own section */}
            <div className="border-t border-stone-200 pt-5 dark:border-stone-800">
              <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Help</p>
              <Link
                to="/chat"
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  chatActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                    : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900'
                }`}
              >
                <SparkleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                AI tutor
              </Link>
            </div>

            {/* Auth */}
            <div className="border-t border-stone-200 pt-5 dark:border-stone-800">
              {isAuth ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white dark:bg-stone-100 dark:text-stone-900">
                      {initial}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900 dark:text-stone-50">{user?.name}</p>
                      <p className="truncate text-xs text-stone-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="h-11 w-full rounded-md border border-stone-300 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex h-11 items-center justify-center rounded-md bg-stone-900 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
                  >
                    Sign up free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}