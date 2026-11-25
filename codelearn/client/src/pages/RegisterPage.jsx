import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Passwords do not match')
    if (form.password.length < 6) return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const res = await fetch('https://coding-learning-platform-4okh.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = form.password
    if (pwd.length === 0) return { strength: 0, text: '', color: '' }
    if (pwd.length < 6) return { strength: 25, text: 'Too short', color: 'bg-red-500' }
    let score = 0
    if (pwd.length >= 8) score += 25
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 25
    if (/[0-9]/.test(pwd)) score += 25
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 25
    if (score >= 75) return { strength: 100, text: 'Strong', color: 'bg-green-500' }
    if (score >= 50) return { strength: 75, text: 'Good', color: 'bg-yellow-500' }
    return { strength: 50, text: 'Weak', color: 'bg-orange-500' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Enhanced card with glassmorphism */}
        <div className="relative">
          {/* Gradient border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          
          <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 hover:shadow-3xl transition-all duration-300">
            
            {/* Header with animated icon */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl sm:text-4xl">🚀</span>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold mt-4 sm:mt-5 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Create your account
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
                Join the coding revolution — free forever
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
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Enhanced form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">👤</span>
                  </div>
                  <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handleChange}
                    required 
                    placeholder="John Doe" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email field */}
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

              {/* Password field with strength indicator */}
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
                    placeholder="Min. 6 characters" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                {/* Password strength indicator */}
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Password strength:</span>
                      <span className={`font-semibold ${
                        passwordStrength.strength === 100 ? 'text-green-500' :
                        passwordStrength.strength === 75 ? 'text-yellow-500' :
                        'text-orange-500'
                      }`}>{passwordStrength.text}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-600">
                      Use 8+ chars with letters, numbers & symbols for strong password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 dark:text-gray-500 text-lg">✓</span>
                  </div>
                  <input 
                    type="password" 
                    name="confirm" 
                    value={form.confirm} 
                    onChange={handleChange}
                    required 
                    placeholder="Repeat your password" 
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300"
                  />
                  {form.confirm && form.password === form.confirm && form.password.length > 0 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms and conditions */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-brand-600 focus:ring-brand-500" required />
                <label htmlFor="terms" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">Privacy Policy</a>
                </label>
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
                    <span>Creating account...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Create Free Account</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white dark:bg-gray-900 text-gray-400">Secure registration</span>
              </div>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-all duration-200 inline-flex items-center gap-1 group/link"
              >
                Sign in
                <span className="group-hover/link:translate-x-0.5 transition-transform duration-200">→</span>
              </Link>
            </p>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <span>🎓</span>
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🏆</span>
                  <span>Earn certificates</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🤖</span>
                  <span>AI tutor included</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🚀</span>
                  <span>No credit card</span>
                </div>
              </div>
            </div>
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

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
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

.delay-1000 {
  animation-delay: 1s;
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
*/