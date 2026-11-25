import { Link } from 'react-router-dom'

const LANGUAGES = [
  {
    lang: 'python',
    name: 'Python',
    emoji: '🐍',
    desc: 'Beginner-friendly language perfect for data science, automation, and web apps.',
    color: 'from-emerald-400 to-sky-500',
    border: 'border-emerald-100 dark:border-emerald-500/20',
    bg: 'hover:bg-gradient-to-br hover:from-emerald-50/50 hover:to-sky-50/50 dark:hover:from-emerald-500/5 dark:hover:to-sky-500/5',
    badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    topics: ['Variables', 'Functions', 'OOP', 'Libraries'],
  },
  {
    lang: 'javascript',
    name: 'JavaScript',
    emoji: '⚡',
    desc: 'The language of the web — build interactive UIs, servers, and full-stack apps.',
    color: 'from-amber-400 to-orange-500',
    border: 'border-amber-100 dark:border-amber-500/20',
    bg: 'hover:bg-gradient-to-br hover:from-amber-50/50 hover:to-orange-50/50 dark:hover:from-amber-500/5 dark:hover:to-orange-500/5',
    badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
    topics: ['DOM', 'Async/Await', 'ES6+', 'APIs'],
  },
  {
    lang: 'java',
    name: 'Java',
    emoji: '☕',
    desc: 'Robust, object-oriented language used in enterprise software and Android apps.',
    color: 'from-orange-500 to-red-500',
    border: 'border-orange-100 dark:border-orange-500/20',
    bg: 'hover:bg-gradient-to-br hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-500/5 dark:hover:to-red-500/5',
    badge: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20',
    topics: ['OOP', 'Collections', 'Threads', 'Spring'],
  },
  {
    lang: 'cpp',
    name: 'C++',
    emoji: '⚙️',
    desc: 'High-performance language for systems programming, games, and competitive coding.',
    color: 'from-blue-500 to-indigo-600',
    border: 'border-blue-100 dark:border-blue-500/20',
    bg: 'hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50 dark:hover:from-blue-500/5 dark:hover:to-indigo-500/5',
    badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
    topics: ['Pointers', 'STL', 'Memory', 'OOP'],
  },
]

const FEATURES = [
  { icon: '🎨', title: 'Interactive Editor', desc: 'Write and run real code directly in your browser with Monaco Editor — the same editor that powers VS Code.' },
  { icon: '🎥', title: 'Curated Videos', desc: 'Hand-picked YouTube tutorials organized by topic and difficulty. No searching — just learning.' },
  { icon: '🤖', title: 'AI Tutor', desc: 'Ask questions and get your code explained instantly by Gemini AI — your personal coding assistant.' },
  { icon: '📜', title: 'Earn Certificates', desc: 'Pass the quiz with 70%+ and download a shareable certificate to show off your new skills.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24 px-4">
        {/* Enhanced background gradient blobs with animation */}
        <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-brand-400 via-purple-400 to-pink-400 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tl from-blue-400 via-cyan-400 to-teal-400 opacity-20 dark:opacity-10 rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-brand-300/10 to-purple-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Animated badge */}
          <div className="inline-block animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm font-semibold bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-brand-600 dark:text-brand-400 rounded-full border border-brand-200 dark:border-brand-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              🚀 Free · No credit card · Open for everyone
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white animate-fade-in-up animation-delay-200">
            Learn to code{' '}
            <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              the smart way
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed animate-fade-in-up animation-delay-400 px-4">
            Master Python, JavaScript, Java, and C++ with an interactive editor, curated videos,
            an AI tutor, and certification quizzes — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-600">
            <Link to="/learn/python" className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-700 rounded-xl hover:from-brand-700 hover:to-brand-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Start Learning Free →
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-200 -z-10"></span>
            </Link>
            <Link to="/chat" className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
              🤖 Try AI Tutor
            </Link>
          </div>

          {/* Enhanced Stats bar */}
          <div className="mt-12 sm:mt-16 md:mt-20 flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-16 text-center">
            {[['4', 'Languages', '🌐'], ['40+', 'Quiz Questions', '📚'], ['100%', 'Free', '💝'], ['AI', 'Powered', '🧠']].map(([val, label, emoji]) => (
              <div key={label} className="group hover:transform hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
                  <span className="text-2xl sm:text-3xl">{emoji}</span>
                  <span>{val}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Language Cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4">
            Choose your language
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Start with any language — switch anytime, learn at your pace
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
          {LANGUAGES.map(({ lang, name, emoji, desc, color, border, bg, badge, topics }) => (
            <div
              key={lang}
              className={`group relative bg-white dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl ${border} p-5 sm:p-6 flex flex-col gap-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer border hover:border-brand-200 dark:hover:border-brand-800 ${bg}`}
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none"></div>
              
              {/* Icon + gradient bar with animation */}
              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl sm:text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {emoji}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10"></div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>

              {/* Topic chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {topics.map(t => (
                  <span key={t} className={`text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${badge} transition-all hover:scale-105`}>
                    {t}
                  </span>
                ))}
              </div>

              <Link
                to={`/learn/${lang}`}
                className="mt-auto relative overflow-hidden group/btn text-center text-sm font-semibold px-4 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 text-gray-700 dark:text-gray-300 hover:text-white dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300"
              >
                <span className="relative z-10">Start Learning →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/30 dark:via-gray-950 dark:to-gray-900/30 border-y border-gray-100 dark:border-gray-800 py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4">
              Everything you need to learn
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No extra tools, no subscriptions — just pure learning</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {FEATURES.map(({ icon, title, desc }, index) => (
              <div key={title} className="group relative bg-white dark:bg-gray-900/40 rounded-2xl p-6 sm:p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
                </div>
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 sm:py-20 md:py-24 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/5 via-purple-600/5 to-pink-600/5 dark:from-brand-600/10 dark:via-purple-600/10 dark:to-pink-600/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-brand-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3 sm:mb-4">
            Ready to start coding?
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto px-4">
            Join CodeLearn for free. No credit card, no setup — just open your browser and start your journey today.
          </p>
          <Link to="/register" className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 rounded-xl hover:from-brand-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
            Create Free Account →
            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-200 -z-10"></span>
          </Link>
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
  <Link
    to="/register"
    className="group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-900 px-8 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/20 dark:bg-white dark:text-gray-900 dark:shadow-white/10"
  >
    <span className="relative z-10">Create free account</span>
    <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
  </Link>

  <Link
    to="/verify"
    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-8 text-sm font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:border-gray-700"
  >
    <span>📜</span>
    <span>Verify a certificate</span>
  </Link>
</div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 sm:py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-gray-400 dark:text-gray-600">
  <Link to="/verify" className="hover:underline">Verify certificate</Link>
  {' · '}
  Built with <span className="text-rose-500">♥</span> using React, Node.js, MongoDB & Gemini AI
</p>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-600 mt-1 sm:mt-2">
            © {new Date().getFullYear()} CodeLearn — Free forever. Empowering developers worldwide.
          </p>
        </div>
      </footer>
    </div>
  )
}

// Add this to your global CSS file or Tailwind config for animations:
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

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s linear infinite;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-600 {
  animation-delay: 0.6s;
}

.delay-1000 {
  animation-delay: 1s;
}
*/