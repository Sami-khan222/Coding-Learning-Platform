import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-brand-300/5 to-purple-300/5 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.1 + Math.random() * 0.2,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#6366f1' : '#a855f7'}, transparent)`,
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center animate-fade-in-up">
        {/* Animated 404 text with gradient */}
        <div className="relative mb-6">
          <div className="text-8xl sm:text-9xl md:text-[12rem] font-black bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient animate-float">
            404
          </div>
          <div className="absolute inset-0 text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text blur-2xl opacity-30">
            404
          </div>
        </div>

        {/* Animated sad emoji with bounce */}
        <div className="relative inline-block mb-4">
          <div className="text-6xl sm:text-7xl md:text-8xl animate-bounce-slow">😵</div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Error message with gradient */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Page not found
        </h1>
        
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Creative suggestions */}
        <div className="max-w-sm mx-auto mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">You might want to:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/" className="text-xs px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300">
              🏠 Go Home
            </Link>
            <Link to="/learn/python" className="text-xs px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300">
              🐍 Start Learning
            </Link>
            <Link to="/chat" className="text-xs px-3 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300">
              🤖 AI Chat
            </Link>
          </div>
        </div>

        {/* Enhanced back button */}
        <Link 
          to="/" 
          className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back to Home</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
        </Link>

        {/* Fun fact or helpful message */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span>💡</span>
            <span>Tip: Check the URL for typos or go back to explore our courses</span>
          </div>
        </div>

        {/* Decorative search suggestion */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 text-xs text-gray-400 dark:text-gray-600">
            <span>🔍 Popular:</span>
            <Link to="/learn/python" className="hover:text-brand-500 transition-colors">Python</Link>
            <span>•</span>
            <Link to="/learn/javascript" className="hover:text-brand-500 transition-colors">JavaScript</Link>
            <span>•</span>
            <Link to="/learn/java" className="hover:text-brand-500 transition-colors">Java</Link>
            <span>•</span>
            <Link to="/learn/cpp" className="hover:text-brand-500 transition-colors">C++</Link>
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
    transform: translateY(30px);
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
    transform: translateY(-20px);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-100px) translateX(50px);
  }
  50% {
    transform: translateY(100px) translateX(-50px);
  }
  75% {
    transform: translateY(-50px) translateX(-100px);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
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

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-particle {
  animation: float-particle linear infinite;
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s linear infinite;
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
*/