import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }) {
  const { isAuth, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4 animate-fade-in-up">
          {/* Enhanced loading spinner with dual rings */}
          <div className="relative">
            <div className="w-14 h-14 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Loading text with typing animation */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Verifying your credentials
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuth) {
    // Save the page they tried to visit so we can redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}