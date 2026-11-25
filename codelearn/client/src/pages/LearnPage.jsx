import { useParams, Link, Navigate } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import VideoPanel from '../components/VideoPanel'

// Same gutters as the home page


const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const VALID_LANGS = ['python', 'javascript', 'java', 'cpp']

// Same logos as the home page language cards (emojis and per-language colors removed)
const LANG_META = {
  python:     { name: 'Python',     logo: `${DEVICON}/python/python-original.svg`,         desc: 'General purpose · Data Science · Automation',   file: 'main.py' },
  javascript: { name: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg`, desc: 'Web Development · Frontend · Backend',          file: 'main.js' },
  java:       { name: 'Java',       logo: `${DEVICON}/java/java-original.svg`,             desc: 'Enterprise · Android · OOP',                    file: 'Main.java' },
  cpp:        { name: 'C++',        logo: `${DEVICON}/cplusplus/cplusplus-original.svg`,   desc: 'Systems · Game Dev · Competitive Coding',       file: 'main.cpp' },
}

const BTN_PRIMARY =
  'inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
const BTN_PRIMARY_SM =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-stone-900 px-4 text-xs font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'

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

/* ── Page ───────────────────────────────────────────────── */

export default function LearnPage() {
  const { lang } = useParams()

  // Redirect if invalid language
  if (!VALID_LANGS.includes(lang)) {
    return <Navigate to="/" replace />
  }

  const meta = LANG_META[lang]

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fcfbf8] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">

      {/* ══════════ Sticky page header ══════════ */}
      <header className="sticky top-16 z-20 border-b border-stone-200 bg-[#fcfbf8]/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Left: language identity */}
            <div className="flex min-w-0 items-center gap-4">
              <img src={meta.logo} alt={`${meta.name} logo`} className="h-9 w-9 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="font-serif text-2xl leading-tight tracking-tight text-stone-900 dark:text-stone-50">
                  {meta.name}
                  <span className="ml-2 font-sans text-sm text-stone-500">/ Learning hub</span>
                </h1>
                <p className="mt-0.5 truncate text-xs text-stone-500">{meta.desc}</p>
              </div>
            </div>

            {/* Right: quick switch + quiz CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-1.5 md:flex">
                <span className="mr-1 text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Switch</span>
                {VALID_LANGS.filter(l => l !== lang).map(l => {
                  const m = LANG_META[l]
                  return (
                    <Link
                      key={l}
                      to={`/learn/${l}`}
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-300 px-3 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-900"
                    >
                      <img src={m.logo} alt="" className="h-4 w-4" />
                      {m.name}
                    </Link>
                  )
                })}
              </div>

              <span aria-hidden className="hidden h-5 w-px bg-stone-200 md:block dark:bg-stone-800" />

              <Link to={`/quiz/${lang}`} className={BTN_PRIMARY_SM}>
                Take quiz
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ Main content ══════════ */}
<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
  <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

    {/* Left: code editor */}
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <Eyebrow>Code editor</Eyebrow>
        <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Ready
        </span>
      </div>

      <WindowFrame title={meta.file} className="min-w-0">
        <CodeEditor language={lang} />
      </WindowFrame>

      <p className="text-center text-xs text-stone-500">
        Powered by Monaco · Write &amp; run code instantly
      </p>
    </section>

    {/* Right: video panel (no WindowFrame, so nothing is clipped) */}
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <Eyebrow>Video lessons</Eyebrow>
        <span className="text-xs text-stone-500">Curated for you</span>
      </div>

      <div className="min-w-0 max-w-full [&_iframe]:max-w-full [&_img]:max-w-full [&_video]:max-w-full">
        <VideoPanel language={lang} />
      </div>

      <p className="text-center text-xs text-stone-500">
        Hand-picked tutorials · Updated regularly
      </p>
    </section>
  </div>
        {/* ══════════ Quiz CTA panel (same dark CTA as the home page) ══════════ */}
        {/* Quiz CTA panel */}
<div className="mt-10 overflow-hidden rounded-2xl bg-stone-900 sm:mt-12">
          <div className="flex flex-col items-start justify-between gap-6 px-8 py-10 sm:flex-row sm:items-center sm:px-12 sm:py-12">
            <div className="min-w-0">
              <h3 className="font-serif text-2xl tracking-tight text-white sm:text-3xl">
                Ready to test your {meta.name} knowledge?
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-stone-300">
                Score 70% or higher on the quiz to earn a certificate you can download and share.
              </p>
            </div>

            <Link
              to={`/quiz/${lang}`}
              className="inline-flex h-12 flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-200"
            >
              Take the {meta.name} quiz
              <ArrowRight />
            </Link>
          </div>
        </div>

        {/* ══════════ Learning tips (home page check-list style) ══════════ */}
        {/* Learning tips */}
<div className="mt-5 border-t border-stone-200 pt-8 dark:border-stone-800">
          <Eyebrow>Tips</Eyebrow>
          <ul className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: 'Write code while watching', desc: 'Pause the video and try each example in the editor.' },
              { title: 'Ask the AI tutor', desc: 'Paste your code in AI Chat when you get stuck.' },
              { title: 'Earn a certificate', desc: 'Pass the quiz and share your achievement.' },
            ].map(({ title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900 dark:text-stone-100">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}