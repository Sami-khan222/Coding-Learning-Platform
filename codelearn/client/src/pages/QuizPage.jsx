import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Same gutters as the home page
const PAD = 'px-6 sm:px-10 lg:px-16 xl:px-20'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

// Same logos as the home page language cards (emojis removed)
const LANG_META = {
  python:     { name: 'Python',     logo: `${DEVICON}/python/python-original.svg` },
  javascript: { name: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg` },
  java:       { name: 'Java',       logo: `${DEVICON}/java/java-original.svg` },
  cpp:        { name: 'C++',        logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
}

const SECONDS_PER_QUESTION = 30

const BTN_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
const BTN_SECONDARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-stone-300 px-6 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900'
const BADGE =
  'inline-flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-2 py-1 font-mono text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400'

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

function LangLogo({ meta, className = 'h-6 w-6' }) {
  return meta.logo ? (
    <img src={meta.logo} alt="" className={className} />
  ) : (
    <span className="font-mono text-sm font-medium text-stone-700 dark:text-stone-300">
      {meta.name?.[0]?.toUpperCase()}
    </span>
  )
}

/* ── Shared shell for centered states ───────────────────── */

function CenteredShell({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fcfbf8] px-6 py-12 text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

function Spinner({ children }) {
  return (
    <span className="relative flex h-14 w-14 items-center justify-center">
      <span aria-hidden className="absolute inset-0 rounded-full border-2 border-stone-200 dark:border-stone-800" />
      <span
        aria-hidden
        className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-stone-900 dark:border-t-stone-100"
        style={{ animationDuration: '1.1s' }}
      />
      {children}
    </span>
  )
}

/* ── Loading ────────────────────────────────────────────── */

function LoadingScreen({ lang }) {
  const meta = LANG_META[lang] || { name: lang }
  return (
    <CenteredShell>
      <div className="flex flex-col items-center gap-5 text-center">
        <Spinner>
          <LangLogo meta={meta} className="h-5 w-5" />
        </Spinner>
        <div>
          <Eyebrow>Quiz</Eyebrow>
          <p className="mt-2 font-serif text-2xl tracking-tight text-stone-900 dark:text-stone-50">
            Loading {meta.name} quiz…
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Get ready to test your skills.</p>
        </div>
      </div>
    </CenteredShell>
  )
}

/* ── Error ──────────────────────────────────────────────── */

function ErrorScreen({ message, lang }) {
  return (
    <CenteredShell>
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        Failed to load quiz.
      </h1>
      <div
        role="alert"
        className="mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-relaxed text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-400"
      >
        {message}
      </div>
      <Link to={`/learn/${lang}`} className={`${BTN_SECONDARY} mt-8`}>
        Back to learning
      </Link>
    </CenteredShell>
  )
}

/* ── Timer bar ──────────────────────────────────────────── */

function TimerBar({ seconds, total }) {
  const pct = (seconds / total) * 100
  const color = seconds > 10 ? 'bg-emerald-500' : seconds > 5 ? 'bg-amber-500' : 'bg-rose-500'

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
      <div
        className={`h-full rounded-full ${color} transition-all duration-1000 ease-linear`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ── Result ─────────────────────────────────────────────── */

function ResultScreen({ score, passed, correct, total, certificateId, lang, onRetry }) {
  const meta = LANG_META[lang] || { name: lang }
  const circumference = 2 * Math.PI * 68

  return (
    <CenteredShell>
      <div className="flex flex-col items-center text-center">
        {/* Score ring */}
        <div className="relative h-40 w-40">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle
              cx="80" cy="80" r="68"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-stone-200 dark:text-stone-800"
            />
            <circle
              cx="80" cy="80" r="68"
              fill="none"
              stroke={passed ? '#10b981' : '#f43f5e'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score / 100)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-4xl tabular-nums tracking-tight text-stone-900 dark:text-stone-50">
              {score}%
            </span>
            <span className="mt-0.5 font-mono text-xs text-stone-500">
              {correct}/{total} correct
            </span>
          </div>
        </div>

        <div className="mt-8">
          <Eyebrow>{passed ? 'Passed' : 'Not passed'}</Eyebrow>
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-[1.1] tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
          {passed ? 'Congratulations.' : 'Keep practicing.'}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-stone-600 dark:text-stone-400">
          {passed
            ? `You scored ${score}% on the ${meta.name} quiz and earned a certificate.`
            : `You scored ${score}%. You need at least 70% to pass. Give it another shot.`}
        </p>

        {/* Actions */}
        <div className="mt-9 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {passed && certificateId && (
            <Link to={`/certificate/${certificateId}`} className={BTN_PRIMARY}>
              View certificate
              <ArrowRight />
            </Link>
          )}
          <button onClick={onRetry} className={BTN_SECONDARY}>
            Try again
          </button>
          <Link to={`/learn/${lang}`} className={BTN_SECONDARY}>
            Back to learning
          </Link>
        </div>
      </div>
    </CenteredShell>
  )
}

/* ── Main QuizPage ──────────────────────────────────────── */

export default function QuizPage() {
  const { lang }  = useParams()
  const { token } = useAuth()
  const navigate  = useNavigate()
  const meta      = LANG_META[lang] || { name: lang }

  const [questions,      setQuestions]      = useState([])
  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answers,        setAnswers]        = useState([])
  const [timeLeft,       setTimeLeft]       = useState(SECONDS_PER_QUESTION)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState('')
  const [submitting,     setSubmitting]     = useState(false)
  const [result,         setResult]         = useState(null)
  const timerRef = useRef(null)

  /* Fetch questions */
  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError('')
    setResult(null)
    setAnswers([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setTimeLeft(SECONDS_PER_QUESTION)

    try {
      const res = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/quiz/${lang}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || `Failed to load quiz (HTTP ${res.status})`)
      setQuestions(data.questions)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [lang, token])

  useEffect(() => { fetchQuestions() }, [fetchQuestions])

  /* Submit quiz */
  const submitQuiz = useCallback(async (finalAnswers) => {
    setSubmitting(true)
    try {
      const questionIds = questions.map(q => q._id)
      const res = await fetch('https://coding-learning-platform-4okh.onrender.com/api/quiz/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ language: lang, questionIds, answers: finalAnswers }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || `Submission failed (HTTP ${res.status})`)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }, [questions, lang, token])

  /* Advance or submit */
  const goNext = useCallback(() => {
    const chosen = selectedAnswer !== null ? selectedAnswer : -1
    const newAnswers = [...answers, chosen]

    clearInterval(timerRef.current)

    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers)
      setCurrentIndex(i => i + 1)
      setSelectedAnswer(null)
      setTimeLeft(SECONDS_PER_QUESTION)
    } else {
      setAnswers(newAnswers)
      submitQuiz(newAnswers)
    }
  }, [selectedAnswer, answers, currentIndex, questions.length, submitQuiz])

  /* Countdown timer */
  /* Countdown tick: only counts down */
useEffect(() => {
  if (loading || result || submitting || questions.length === 0) return
  const id = setInterval(() => setTimeLeft((t) => t - 1), 1000)
  return () => clearInterval(id)
}, [loading, result, submitting, questions.length, currentIndex])

/* When time runs out: move on (separate effect, so it runs once) */
useEffect(() => {
  if (timeLeft <= 0 && !loading && !result && !submitting && questions.length > 0) {
    goNext()
  }
}, [timeLeft, loading, result, submitting, questions.length, goNext])

  /* ── Render states ───────────────────────────────────── */
  if (loading) return <LoadingScreen lang={lang} />
  if (error && !result) return <ErrorScreen message={error} lang={lang} />

  if (submitting) {
    return (
      <CenteredShell>
        <div className="flex flex-col items-center gap-5 text-center">
          <Spinner />
          <div>
            <p className="font-serif text-2xl tracking-tight text-stone-900 dark:text-stone-50">
              Calculating your score…
            </p>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">Evaluating your answers.</p>
          </div>
        </div>
      </CenteredShell>
    )
  }

  if (result) {
    return <ResultScreen {...result} lang={lang} onRetry={fetchQuestions} />
  }

    const question = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const progress = (currentIndex / questions.length) * 100

  const timeColor =
    timeLeft > 10
      ? 'text-emerald-700 dark:text-emerald-400'
      : timeLeft > 5
      ? 'text-amber-700 dark:text-amber-400'
      : 'text-rose-700 dark:text-rose-400'

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden bg-[#fcfbf8] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      {/* ══════════ Header: language, question count, timer, progress ══════════ */}
      <header className="shrink-0 border-b border-stone-200 dark:border-stone-800">
        <div className={`mx-auto max-w-6xl ${PAD} py-3`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <LangLogo meta={meta} className="h-6 w-6" />
              <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{meta.name} quiz</p>
            </div>

            <span className={BADGE}>
  Question{' '}
  <span className="font-semibold tabular-nums text-stone-900 dark:text-white">{currentIndex + 1}</span>
  <span className="text-stone-400 dark:text-stone-600">/</span>
  <span className="tabular-nums">{questions.length}</span>
</span>
          </div>

          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div
              className="h-full rounded-full bg-stone-900 transition-all duration-500 ease-out dark:bg-stone-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* ══════════ Body: scrolls only if the window is very small ══════════ */}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={`mx-auto grid max-w-6xl gap-6 ${PAD} py-6 lg:grid-cols-2 lg:gap-10 lg:py-10`}>
          {/* Left: timer bar + question */}
          <section className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {question.difficulty && <span className={BADGE}>{question.difficulty}</span>}
              {question.topic && <span className="text-xs text-stone-500">{question.topic}</span>}
            </div>

            <div className="mb-5 flex items-center gap-3">
  <div className="flex-1">
    <TimerBar seconds={Math.max(timeLeft, 0)} total={SECONDS_PER_QUESTION} />
  </div>
  <span className={`w-10 shrink-0 text-right font-mono text-sm font-medium tabular-nums ${timeColor}`}>
    {Math.max(timeLeft, 0)}s
  </span>
</div>

            <WindowFrame title={`question-${String(currentIndex + 1).padStart(2, '0')}`}>
              <div className="p-5 sm:p-6">
                <Eyebrow>Question {currentIndex + 1}</Eyebrow>
                <h2 className="mt-3 font-serif text-xl leading-snug tracking-tight text-stone-900 sm:text-2xl dark:text-stone-50">
                  {question.questionText}
                </h2>
              </div>
            </WindowFrame>
          </section>

          {/* Right: options + submit */}
          <section className="min-w-0">
            <div className="grid grid-cols-1 gap-2.5">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedAnswer(idx)}
                    aria-pressed={isSelected}
                    className={`group flex w-full items-center gap-4 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-800'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs transition-colors ${
                        isSelected
                          ? 'bg-white/15 text-white dark:bg-stone-900/10 dark:text-stone-900'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:group-hover:bg-stone-700'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-4 border-t border-stone-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    selectedAnswer !== null ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                />
                <p className="text-xs text-stone-500">
                  {selectedAnswer === null ? 'Select an answer, or wait for the timer' : 'Answer selected'}
                </p>
              </div>

              <button onClick={goNext} className={BTN_PRIMARY}>
                {isLast ? 'Submit quiz' : 'Next question'}
                {isLast ? <Check /> : <ArrowRight />}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}