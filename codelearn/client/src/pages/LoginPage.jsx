import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      login(data.token, data.user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Decorative card with glassmorphism */}
        <div className="relative">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 hover:shadow-3xl transition-all duration-300">
            
            {/* Header with animated icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl sm:text-4xl">💻</span>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
                Sign in to continue your coding journey
              </p>
            </div>

            {/* Enhanced error message */}
            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-shake">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span className="flex-1">{error}</span>
                  <button 
                    onClick={() => setError('')} 
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">📧</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">🔒</span>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Forgot password link */}
              <div className="text-right">
                <button 
                  type="button"
                  className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Enhanced submit button */}
              <button
                type="submit"
                disabled={loading}
                className="relative group w-full py-3 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                )}
              </button>
            </form>

            {/* Divider with demo credentials hint */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-400">Secure login</span>
              </div>
            </div>

            {/* Sign up link with enhanced styling */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-all duration-200 inline-flex items-center gap-1 group/link"
              >
                Sign up free
                <span className="group-hover/link:translate-x-0.5 transition-transform duration-200">→</span>
              </Link>
            </p>

            {/* Features list */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center justify-between">
                  <span>🔐 Secure authentication</span>
                  <span>⚡ Instant access</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🎓 Track your progress</span>
                  <span>🏆 Earn certificates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo credentials alert - helpful for testing */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>💡</span>
            <span>Demo: demo@example.com / password123</span>
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.delay-1000 {
  animation-delay: 1s;
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
*/