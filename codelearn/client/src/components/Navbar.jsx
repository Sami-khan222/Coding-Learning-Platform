import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LANGUAGES = [
  { label: 'Python',     lang: 'python',     color: 'text-emerald-500', icon: '🐍' },
  { label: 'JavaScript', lang: 'javascript',  color: 'text-amber-500', icon: '⚡' },
  { label: 'Java',       lang: 'java',        color: 'text-orange-500', icon: '☕' },
  { label: 'C++',        lang: 'cpp',         color: 'text-blue-500', icon: '⚙️' },
]

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Navbar() {
  const { isAuth, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [menuOpen, setMenuOpen] = useState(false)

  // Sync dark class with state
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('cl_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('cl_theme', 'light')
    }
  }, [dark])

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem('cl_theme')
    if (saved === 'dark') {
      setDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActiveLang = (lang) => location.pathname === `/learn/${lang}`

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo with animation */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative">
            <div className="relative">
              <span className="text-2xl sm:text-3xl transition-transform group-hover:scale-110 duration-300 inline-block">
                💻
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 -z-10"></div>
            </div>
            <div className="relative">
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                CodeLearn
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-brand-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </div>
          </Link>

          {/* Desktop: Language links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {LANGUAGES.map(({ label, lang, color, icon }) => (
              <Link
                key={lang}
                to={`/learn/${lang}`}
                className={`relative group px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden
                  ${isActiveLang(lang)
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {/* Active indicator background */}
                {isActiveLang(lang) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-500/10 dark:to-purple-500/10 rounded-xl"></div>
                )}
                
                {/* Hover background */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <span className="relative z-10 flex items-center gap-2">
                  <span className={`${color} text-base group-hover:scale-110 transition-transform duration-300 inline-block`}>
                    {icon}
                  </span>
                  <span>{label}</span>
                  {isActiveLang(lang) && (
                    <span className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"></span>
                  )}
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop: Right side */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* AI Chat link with glow effect */}
            <Link
              to="/chat"
              className="group relative px-3 lg:px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-base group-hover:scale-110 transition-transform duration-300">🤖</span>
                <span>AI Chat</span>
              </span>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-500/5 dark:to-purple-500/5 rounded-xl"></div>
              </div>
            </Link>

            {/* Dark mode toggle with enhanced animation */}
            <button
              onClick={() => setDark(d => !d)}
              className="group relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-800/50 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              <div className="relative z-10">
                {dark ? <SunIcon /> : <MoonIcon />}
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {/* Auth buttons with modern design */}
            {isAuth ? (
              <div className="flex items-center gap-3 ml-2">
                <div className="relative group/avatar">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </div>
                  
                  {/* Hover card */}
                  <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-300 transform translate-y-2 group-hover/avatar:translate-y-0 z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2">
                      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                        Signed in as
                        <div className="font-medium text-gray-900 dark:text-white mt-1">{user?.email}</div>
                      </div>
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors mt-1">
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="relative px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300">
                  Login
                </Link>
                <Link to="/register" className="group relative px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                  <span className="relative z-10">Sign up</span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: right side buttons */}
          <div className="flex md:hidden items-center gap-1 sm:gap-2">
            <button
              onClick={() => setDark(d => !d)}
              className="group p-2 sm:p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 sm:p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu with animations */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg animate-slide-down">
          <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-2">
            {/* Language links with icons */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3 pb-2">
                Programming Languages
              </div>
              {LANGUAGES.map(({ label, lang, color, icon }) => (
                <Link
                  key={lang}
                  to={`/learn/${lang}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                    ${isActiveLang(lang)
                      ? 'bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-500/10 dark:to-purple-500/10 text-brand-600 dark:text-brand-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <span className={`${color} text-lg group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </span>
                  <span className="flex-1">{label}</span>
                  {isActiveLang(lang) && (
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* AI Chat link */}
            <Link to="/chat" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group">
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">🤖</span>
              <span>AI Chat</span>
            </Link>

            {/* Auth section */}
            <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
              {isAuth ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="w-full btn-secondary text-sm py-3 rounded-xl">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="w-full btn-secondary text-sm py-3 rounded-xl text-center">
                    Login
                  </Link>
                  <Link to="/register" className="w-full btn-primary text-sm py-3 rounded-xl text-center">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// Add these animations to your global CSS or Tailwind config:
/*
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

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s linear infinite;
}

.btn-primary {
  @apply relative px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300;
}

.btn-secondary {
  @apply relative px-5 py-2 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-all duration-300;
}
*/