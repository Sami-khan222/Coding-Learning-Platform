import { useParams, Link, Navigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import VideoPanel from '../components/VideoPanel'

const VALID_LANGS = ['python', 'javascript', 'java', 'cpp']

const LANG_META = {
  python:     { name: 'Python',     emoji: '🐍', color: 'text-emerald-500', gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', desc: 'General purpose · Data Science · Automation' },
  javascript: { name: 'JavaScript', emoji: '⚡', color: 'text-amber-500', gradient: 'from-amber-500 to-yellow-500', bg: 'bg-amber-500/10', desc: 'Web Development · Frontend · Backend' },
  java:       { name: 'Java',       emoji: '☕', color: 'text-orange-500', gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-500/10', desc: 'Enterprise · Android · OOP' },
  cpp:        { name: 'C++',        emoji: '⚙️', color: 'text-blue-500',  gradient: 'from-blue-500 to-indigo-600', bg: 'bg-blue-500/10', desc: 'Systems · Game Dev · Competitive Coding' },
}

export default function LearnPage() {
  const { lang } = useParams()

  // Redirect if invalid language
  if (!VALID_LANGS.includes(lang)) {
    return <Navigate to="/" replace />
  }

  const meta = LANG_META[lang]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

      {/* ── Enhanced Page Header with glassmorphism ── */}
      <div className="sticky top-16 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Animated icon with gradient background */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                  {meta.emoji}
                </div>
              </div>
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold flex flex-wrap items-center gap-2">
                  <span className={`bg-gradient-to-r ${meta.gradient} bg-clip-text text-transparent`}>
                    {meta.name}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600 font-normal text-base hidden sm:inline">/</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-normal">Learning Hub</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${meta.color.replace('text', 'bg')}`}></span>
                  {meta.desc}
                </p>
              </div>
            </div>

            {/* Enhanced Quick nav with modern styling */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 dark:text-gray-600 font-medium">Quick switch:</span>
              <div className="flex gap-1.5">
                {VALID_LANGS.filter(l => l !== lang).map(l => (
                  <Link
                    key={l}
                    to={`/learn/${l}`}
                    className={`group relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 ${
                      LANG_META[l].bg
                    } text-gray-600 dark:text-gray-400 hover:text-white dark:hover:text-white overflow-hidden`}
                  >
                    <span className="relative z-10 flex items-center gap-1">
                      <span className="text-sm">{LANG_META[l].emoji}</span>
                      <span className="hidden sm:inline">{LANG_META[l].name}</span>
                    </span>
                    <div className={`absolute inset-0 bg-gradient-to-r ${LANG_META[l].gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </Link>
                ))}
              </div>
              
              {/* Enhanced Quiz button */}
              <Link
                to={`/quiz/${lang}`}
                className="group relative ml-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  <span>📝</span>
                  <span>Take Quiz →</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content: Two Column Layout with enhanced styling ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left: Code Editor Section */}
          <div className="flex flex-col gap-4 animate-fade-in-left">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span className="text-base">🖊️</span>
                <span>Code Editor</span>
              </h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] text-gray-400 dark:text-gray-600">Ready</span>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                <CodeEditor language={lang} />
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center flex items-center justify-center gap-2">
              <span>⚡ Powered by Monaco (VS Code engine)</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span>💡 Write & run code instantly</span>
            </p>
          </div>

          {/* Right: Video Panel Section */}
          <div className="flex flex-col gap-4 animate-fade-in-right">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <span className="text-base">📹</span>
                <span>Video Lessons</span>
              </h2>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 dark:text-gray-600">Curated for you</span>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative rounded-xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800">
                <VideoPanel language={lang} />
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 text-center flex items-center justify-center gap-2">
              <span>🎯 Hand-picked tutorials</span>
              <span className="w-1 h-1 rounded-full bg-gray-400"></span>
              <span>📚 Updated regularly</span>
            </p>
          </div>
        </div>

        {/* Enhanced Bottom CTA bar */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-brand-50 via-purple-50 to-brand-50 dark:from-brand-950/30 dark:via-purple-950/30 dark:to-brand-950/30 border border-brand-200 dark:border-brand-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-up">
          <div className="text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎯</span>
              <p className="font-bold text-brand-800 dark:text-brand-300 text-sm sm:text-base">
                Ready to test your {meta.name} knowledge?
              </p>
            </div>
            <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400">
              Pass the quiz with 70%+ to earn your certificate and showcase your skills.
            </p>
          </div>
          
          <Link
            to={`/quiz/${lang}`}
            className="group relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-base">📝</span>
              <span>Take the {meta.name} Quiz</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
          </Link>
        </div>

        {/* Learning tips section */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <span className="text-lg">💡</span>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pro Tip</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Write code while watching videos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <span className="text-lg">🤖</span>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">AI Assistant</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Ask questions in AI Chat</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <span className="text-lg">🏆</span>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Certificate</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">Share your achievement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add these animations to your global CSS or Tailwind config:
/*
@keyframes fade-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

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

.animate-fade-in-left {
  animation: fade-in-left 0.5s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.5s ease-out forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.hover\:shadow-3xl:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
*/