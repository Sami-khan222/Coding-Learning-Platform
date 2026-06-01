import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LANG_META = {
  python:     { name: 'Python',     emoji: '🐍', color: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
  javascript: { name: 'JavaScript', emoji: '⚡', color: 'text-amber-400', gradient: 'from-amber-500 to-yellow-500' },
  java:       { name: 'Java',       emoji: '☕', color: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
  cpp:        { name: 'C++',        emoji: '⚙️', color: 'text-blue-400',  gradient: 'from-blue-500 to-indigo-600' },
}

const SECONDS_PER_QUESTION = 30

// ── Enhanced Sub-components ────────────────────────────────────────────────

function LoadingScreen({ lang }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center animate-fade-in-up">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300 mx-auto"></div>
        </div>
        <p className="text-gray-300 text-lg font-medium mt-4">Loading {LANG_META[lang]?.name} quiz...</p>
        <p className="text-gray-600 text-sm mt-1">Get ready to test your skills</p>
      </div>
    </div>
  )
}

function ErrorScreen({ message, lang }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-shake">
        <div className="relative inline-block mb-4">
          <div className="text-7xl animate-bounce">⚠️</div>
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
          Failed to load quiz
        </h2>
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl px-4 py-3 mb-6">
          <p className="text-red-400 text-sm">{message}</p>
        </div>
        <Link to={`/learn/${lang}`} className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold transition-all duration-300 hover:scale-105">
          <span>←</span>
          <span>Back to Learning</span>
        </Link>
      </div>
    </div>
  )
}

function TimerBar({ seconds, total }) {
  const pct = (seconds / total) * 100
  const color = seconds > 10 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : seconds > 5 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
  return (
    <div className="relative w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${pct}%` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    </div>
  )
}

function ResultScreen({ score, passed, correct, total, certificateId, lang, onRetry }) {
  const meta = LANG_META[lang] || {}
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center animate-fade-in-up">

        {/* Enhanced Score circle with confetti effect for pass */}
        <div className="relative w-40 h-40 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90 transform transition-all duration-500 hover:scale-105" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="68" fill="none" stroke="#1f2937" strokeWidth="12" />
            <circle
              cx="80" cy="80" r="68" fill="none"
              stroke={passed ? '#22c55e' : '#ef4444'}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 68}`}
              strokeDashoffset={`${2 * Math.PI * 68 * (1 - score / 100)}`}
              className="transition-all duration-1000"
              style={{ filter: passed ? 'drop-shadow(0 0 8px #22c55e)' : 'none' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${passed ? 'text-green-400' : 'text-red-400'} animate-pulse`}>
              {score}%
            </span>
            <span className="text-gray-500 text-xs mt-0.5">{correct}/{total} correct</span>
          </div>
        </div>

        {/* Enhanced Pass / Fail badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-lg font-bold mb-4 backdrop-blur-sm
          ${passed
            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500 text-green-400'
            : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500 text-red-400'
          }`}>
          {passed ? (
            <>
              <span className="text-xl animate-bounce">🎉</span>
              <span>Passed! 🏆</span>
            </>
          ) : (
            <>
              <span className="text-xl">😞</span>
              <span>Not passed</span>
            </>
          )}
        </div>

        <p className="text-gray-400 mb-8 text-sm leading-relaxed px-4">
          {passed
            ? `Congratulations ${meta.emoji} You scored ${score}% on the ${meta.name} quiz and earned a certificate!`
            : `You scored ${score}%. You need at least 70% to pass. Keep practicing ${meta.emoji} and try again!`
          }
        </p>

        {/* Enhanced Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {passed && certificateId && (
            <Link
              to={`/certificate/${certificateId}`}
              className="group relative px-6 py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🏆</span>
                <span>View Certificate</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </span>
            </Link>
          )}
          <button onClick={onRetry} className="group px-6 py-3 rounded-xl text-base font-semibold text-gray-300 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-brand-500 hover:text-white transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <span>🔄</span>
              <span>Try Again</span>
            </span>
          </button>
          <Link to={`/learn/${lang}`} className="group px-6 py-3 rounded-xl text-base font-semibold text-gray-300 bg-gray-800/50 backdrop-blur-sm border border-gray-700 hover:border-brand-500 hover:text-white transition-all duration-300 hover:scale-105">
            <span className="flex items-center gap-2">
              <span>📚</span>
              <span>Back to Learning</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Main QuizPage with enhanced UI ─────────────────────────────────────────────────
export default function QuizPage() {
  const { lang }    = useParams()
  const { token }   = useAuth()
  const navigate    = useNavigate()
  const meta        = LANG_META[lang] || { name: lang, emoji: '💻', color: 'text-brand-400', gradient: 'from-brand-500 to-purple-500' }

  const [questions,      setQuestions]      = useState([])
  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)   // index of selected option
  const [answers,        setAnswers]         = useState([])    // submitted answers per question
  const [timeLeft,       setTimeLeft]        = useState(SECONDS_PER_QUESTION)
  const [loading,        setLoading]         = useState(true)
  const [error,          setError]           = useState('')
  const [submitting,     setSubmitting]      = useState(false)
  const [result,         setResult]          = useState(null)  // { passed, score, correct, total, certificateId }
  const timerRef = useRef(null)

  // Load questions on mount
  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setAnswers([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setTimeLeft(SECONDS_PER_QUESTION)

    try {
      const res = await fetch(`/api/quiz/${lang}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to load quiz')
      setQuestions(data.questions)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [lang, token])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  // Submit all answers to backend
  const submitQuiz = useCallback(async (finalAnswers) => {
    setSubmitting(true)
    try {
      const questionIds = questions.map(q => q._id)
      const res = await fetch('/api/quiz/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ language: lang, questionIds, answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }, [questions, lang, token])

  // Advance to next question or submit
  const goNext = useCallback(() => {
    const chosen = selectedAnswer !== null ? selectedAnswer : -1  // -1 = skipped
    const newAnswers = [...answers, chosen]

    clearInterval(timerRef.current)

    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers)
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setTimeLeft(SECONDS_PER_QUESTION)
    } else {
      // Last question — submit
      setAnswers(newAnswers)
      submitQuiz(newAnswers)
    }
  }, [selectedAnswer, answers, currentIndex, questions.length, submitQuiz])

  // Countdown timer
  useEffect(() => {
    if (loading || result || submitting || questions.length === 0) return

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          goNext()   // auto-advance when time runs out
          return SECONDS_PER_QUESTION
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [loading, result, submitting, questions.length, currentIndex, goNext])

  // ── Render states ─────────────────────────────────────────────
  if (loading) return <LoadingScreen lang={lang} />
  if (error && !result) return <ErrorScreen message={error} lang={lang} />
  if (submitting) return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300 mx-auto"></div>
        </div>
        <p className="text-gray-300 text-lg mt-4">Calculating your score...</p>
        <p className="text-gray-600 text-sm mt-1">Evaluating your answers</p>
      </div>
    </div>
  )
  if (result) return (
    <ResultScreen
      {...result}
      lang={lang}
      onRetry={fetchQuestions}
    />
  )

  const question = questions[currentIndex]
  const isLast   = currentIndex === questions.length - 1
  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">

      {/* ── Enhanced Top bar with glassmorphism ── */}
      <div className="sticky top-16 z-20 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 py-4">
        <div className="max-w-3xl mx-auto">

          {/* Language + progress label */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-sm shadow-lg`}>
                {meta.emoji}
              </div>
              <div>
                <span className={`text-sm font-bold ${meta.color}`}>{meta.name}</span>
                <span className="text-gray-600 text-xs ml-1">Quiz</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <span className="text-xs text-gray-400">Question</span>
              <span className="text-sm font-bold text-white">{currentIndex + 1}</span>
              <span className="text-xs text-gray-600">of</span>
              <span className="text-sm font-bold text-white">{questions.length}</span>
            </div>
          </div>

          {/* Enhanced Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${meta.gradient} rounded-full transition-all duration-500 relative`}
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Enhanced Quiz card ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-3xl animate-fade-in-up">

          {/* Timer section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 backdrop-blur-sm text-gray-400">
                {question.difficulty}
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-500">{question.topic}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 backdrop-blur-sm">
              <span className={`text-sm font-mono font-bold tabular-nums
                ${timeLeft > 10 ? 'text-green-400' : timeLeft > 5 ? 'text-yellow-400' : 'text-red-400 animate-pulse'}`}>
                ⏱ {timeLeft}s
              </span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="mb-6">
            <TimerBar seconds={timeLeft} total={SECONDS_PER_QUESTION} />
          </div>

          {/* Enhanced Question card */}
          <div className="relative group mb-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}>
                  ?
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  {question.questionText}
                </h2>
              </div>
            </div>
          </div>

          {/* Enhanced Answer options */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            {question.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`group relative w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-sm transition-all duration-300 overflow-hidden
                    ${isSelected
                      ? `border-transparent bg-gradient-to-r ${meta.gradient} text-white scale-[1.01] shadow-lg`
                      : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm text-gray-300 hover:border-gray-500 hover:bg-gray-800 hover:scale-[1.01]'
                    }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${meta.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10 flex items-center">
                    <span className={`inline-flex w-8 h-8 rounded-full border-2 mr-4 items-center justify-center text-xs font-bold shrink-0 transition-all duration-300
                      ${isSelected 
                        ? 'border-white/30 bg-white/20 text-white' 
                        : 'border-gray-600 text-gray-500 group-hover:border-gray-400'
                      }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {isSelected && (
                      <span className="text-base animate-bounce">✓</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Next / Submit button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedAnswer !== null ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
              <p className="text-xs text-gray-500">
                {selectedAnswer === null ? 'Select an answer or wait for timer' : 'Answer selected'}
              </p>
            </div>
            <button
              onClick={goNext}
              className="group relative px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLast ? (
                  <>
                    <span>✅</span>
                    <span>Submit Quiz</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </>
                )}
              </span>
            </button>
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-bounce {
  animation: bounce 0.5s ease-in-out;
}

.animate-pulse {
  animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}
*/