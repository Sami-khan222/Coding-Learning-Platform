import { Link } from 'react-router-dom'

// Page gutters: 24px on mobile, up to 80px on large screens
const PAD = 'px-6 sm:px-10 lg:px-16 xl:px-20'

/* ───────────────────────── Data ───────────────────────── */

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const LANGUAGES = [
  {
    lang: 'python',
    name: 'Python',
    logo: `${DEVICON}/python/python-original.svg`,
    desc: 'Beginner-friendly, and a strong fit for data science, automation and web apps.',
    topics: ['Variables', 'Functions', 'OOP', 'Libraries'],
  },
  {
    lang: 'javascript',
    name: 'JavaScript',
    logo: `${DEVICON}/javascript/javascript-original.svg`,
    desc: 'The language of the web. Build interactive UIs, servers and full-stack apps.',
    topics: ['DOM', 'Async/Await', 'ES6+', 'APIs'],
  },
  {
    lang: 'java',
    name: 'Java',
    logo: `${DEVICON}/java/java-original.svg`,
    desc: 'Robust and object-oriented, used across enterprise software and Android.',
    topics: ['OOP', 'Collections', 'Threads', 'Spring'],
  },
  {
    lang: 'cpp',
    name: 'C++',
    logo: `${DEVICON}/cplusplus/cplusplus-original.svg`,
    desc: 'High-performance code for systems programming, games and competitive coding.',
    topics: ['Pointers', 'STL', 'Memory', 'OOP'],
  },
]

const STATS = [
  { value: '4', label: 'Languages' },
  { value: '40+', label: 'Quiz questions' },
  { value: '70%', label: 'Pass mark' },
  { value: '$0', label: 'Cost' },
]

/* ───────────────────────── Small pieces ───────────────────────── */

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

function SectionHeading({ eyebrow, title, children, className = '' }) {
  return (
    <div className={className}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl dark:text-stone-50">
        {title}
      </h2>
      {children && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600 dark:text-stone-400">{children}</p>
      )}
    </div>
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

/* ───────────────────────── Product mockups ───────────────────────── */

function EditorMock() {
  return (
    <WindowFrame title="main.py">
      <div className="grid grid-cols-[2.5rem_1fr] font-mono text-[13px] leading-6">
        <div className="select-none border-r border-stone-100 py-4 pr-3 text-right text-stone-400 dark:border-stone-800 dark:text-stone-600">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n}>{n}</div>
          ))}
        </div>
        <pre className="overflow-x-auto py-4 pl-4 pr-4 text-stone-800 dark:text-stone-200">
          <code>
            <span className="text-indigo-600 dark:text-indigo-400">def</span>{' '}
            <span className="text-amber-700 dark:text-amber-400">greet</span>(name):{'\n'}
            {'    '}
            <span className="text-indigo-600 dark:text-indigo-400">return</span>{' '}
            <span className="text-emerald-700 dark:text-emerald-400">f"Hello, {'{name}'}!"</span>
            {'\n\n'}
            <span className="text-stone-400"># Try changing the name</span>
            {'\n'}
            <span className="text-sky-700 dark:text-sky-400">print</span>(greet(
            <span className="text-emerald-700 dark:text-emerald-400">"world"</span>))
          </code>
        </pre>
      </div>
      <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-950/50">
        <div className="font-mono text-xs text-stone-600 dark:text-stone-400">
          <span className="text-stone-400">$ </span>Hello, world!
        </div>
        <span className="rounded-md bg-stone-900 px-3 py-1 text-xs font-medium text-white dark:bg-stone-100 dark:text-stone-900">
          Run
        </span>
      </div>
    </WindowFrame>
  )
}

function TutorMock() {
  return (
    <div className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-stone-900 px-4 py-2.5 text-sm text-white dark:bg-stone-100 dark:text-stone-900">
        Why does my loop never stop?
      </div>
      <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-stone-100 px-4 py-3 text-sm leading-relaxed text-stone-700 dark:bg-stone-800 dark:text-stone-300">
        Your condition <code className="rounded bg-white px-1 py-0.5 font-mono text-xs dark:bg-stone-900">i &lt; 10</code>{' '}
        is always true because <code className="rounded bg-white px-1 py-0.5 font-mono text-xs dark:bg-stone-900">i</code>{' '}
        is never incremented. Add <code className="rounded bg-white px-1 py-0.5 font-mono text-xs dark:bg-stone-900">i += 1</code>{' '}
        inside the loop.
      </div>
      <div className="flex items-center justify-between rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-400 dark:border-stone-700">
        Ask a follow-up…
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  )
}

function VideoMock() {
  const items = [
    { t: 'Variables and data types', d: '12:40', active: true },
    { t: 'Conditionals', d: '09:15' },
    { t: 'Loops in practice', d: '14:02' },
  ]
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="relative aspect-video bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=70"
          alt=""
          className="h-full w-full object-cover opacity-70"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-stone-900">
            <svg viewBox="0 0 20 20" className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M6 4.5v11l9-5.5-9-5.5Z" />
            </svg>
          </span>
        </div>
      </div>
      <ul className="divide-y divide-stone-100 dark:divide-stone-800">
        {items.map((i) => (
          <li key={i.t} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className={i.active ? 'font-medium text-stone-900 dark:text-white' : 'text-stone-500'}>{i.t}</span>
            <span className="font-mono text-xs text-stone-400">{i.d}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CertificateMock() {
  return (
    <div className="rounded-xl border border-stone-200 bg-[#fbf9f4] p-2 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-stone-700">
      <div className="rounded-lg border border-stone-300 px-8 py-10 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-500">CodeLearn</p>
        <p className="mt-4 font-serif text-2xl text-stone-900">Certificate of Completion</p>
        <p className="mt-5 text-xs text-stone-500">This certifies that</p>
        <p className="mt-2 border-b border-stone-300 pb-2 font-serif text-xl italic text-stone-800">Your Name</p>
        <p className="mt-4 text-xs leading-relaxed text-stone-500">
          has passed the Python certification quiz with a score of <span className="font-semibold text-stone-800">86%</span>
        </p>
        <p className="mt-6 font-mono text-[10px] tracking-wider text-stone-400">ID · CL-8F3A-21C9</p>
      </div>
    </div>
  )
}

/* ───────────────────────── Feature row ───────────────────────── */

function FeatureRow({ eyebrow, title, body, points, visual, flip }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
      <div className={flip ? 'lg:order-2' : ''}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="mt-3 font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">{title}</h3>
        <p className="mt-4 max-w-md leading-relaxed text-stone-600 dark:text-stone-400">{body}</p>
        <ul className="mt-6 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm text-stone-700 dark:text-stone-300">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={flip ? 'lg:order-1' : ''}>{visual}</div>
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfbf8] text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
      {/* ─────────── HERO ─────────── */}
      <section
        className={`mx-auto grid max-w-7xl items-center gap-14 ${PAD} pb-24 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20 lg:pb-36`}
        >
        <div>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Free to use. No credit card required.
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-50">
            Learn to code by writing code.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600 dark:text-stone-400">
            Python, JavaScript, Java and C++ in one place: a browser editor, curated video lessons, an AI tutor for when
            you're stuck, and a certificate when you're done.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/learn/python"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              Start learning
              <ArrowRight />
            </Link>
            <Link
              to="/chat"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-stone-300 px-6 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
            >
              Try the AI tutor
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-4 gap-4 border-t border-stone-200 pt-6 dark:border-stone-800">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <dt className="font-serif text-2xl text-stone-900 dark:text-stone-50">{value}</dt>
                <dd className="mt-1 text-xs text-stone-500">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <EditorMock />
          <div className="absolute -bottom-8 -left-4 hidden w-64 rounded-xl border border-stone-200 bg-white p-4 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] sm:block lg:-left-10 dark:border-stone-800 dark:bg-stone-900">
            <p className="text-[11px] font-medium uppercase tracking-wider text-stone-400">AI tutor</p>
            <p className="mt-1.5 text-sm leading-snug text-stone-700 dark:text-stone-300">
              The f before the quote lets you place variables inside the string.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── LANGUAGES ─────────── */}
      <section className="border-y border-stone-200 bg-white py-24 sm:py-32 dark:border-stone-800 dark:bg-stone-900/30">
        <div className={`mx-auto max-w-7xl ${PAD}`}>
          <SectionHeading eyebrow="Curriculum" title="Pick a language to start with">
            You can switch whenever you like. Your progress in each one is saved separately.
          </SectionHeading>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-4 dark:border-stone-800 dark:bg-stone-800">
            {LANGUAGES.map(({ lang, name, logo, desc, topics }) => (
              <Link
                key={lang}
                to={`/learn/${lang}`}
                className="group flex flex-col bg-white p-7 transition-colors hover:bg-stone-50 dark:bg-stone-950 dark:hover:bg-stone-900"
              >
                <img src={logo} alt={`${name} logo`} className="h-10 w-10" loading="lazy" />
                <h3 className="mt-6 text-lg font-semibold text-stone-900 dark:text-white">{name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">{desc}</p>
                <p className="mt-5 text-xs text-stone-500">{topics.join(' · ')}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-stone-900 dark:text-stone-100">
                  Start {name}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className={`mx-auto max-w-7xl space-y-28 ${PAD} py-24 sm:space-y-40 sm:py-32`}>
        <FeatureRow
          eyebrow="Video lessons"
          title="Watch less, build more"
          body="Every topic has a short, hand-picked tutorial. No hunting through search results for something at the right level."
          points={['Organized by topic and difficulty', 'Watch next to the editor', 'Pick up where you left off']}
          visual={<VideoMock />}
        />
        <FeatureRow
          flip
          eyebrow="AI tutor"
          title="Stuck? Ask in plain English"
          body="Paste your code and ask what's wrong. The tutor explains the problem and points to the fix instead of just handing over an answer."
          points={['Explains errors and concepts', 'Understands the code you wrote', 'Powered by Gemini']}
          visual={<TutorMock />}
        />
        <FeatureRow
          eyebrow="Certificates"
          title="Pass the quiz, get a certificate"
          body="Score 70% or higher and download a certificate. Anyone can check that it's real using its ID."
          points={['Downloadable and shareable', 'Public verification page', 'Retake the quiz any time']}
          visual={<CertificateMock />}
        />
      </section>

      {/* ─────────── CTA ─────────── */}
      <section className={`${PAD} pb-24 sm:pb-32`}>
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-stone-900">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=70"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
            loading="lazy"
          />
          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-24">
            <h2 className="mx-auto max-w-2xl font-serif text-3xl tracking-tight text-white sm:text-5xl">
              Write your first program today.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-stone-300">
              Create an account to save your progress and earn certificates. There's nothing to install.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-medium text-stone-900 transition-colors hover:bg-stone-200"
              >
                Create free account
                <ArrowRight />
              </Link>
              <Link
                to="/verify"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-white/25 px-7 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Verify a certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* ─────────── FOOTER ─────────── */}
      <footer className="border-t border-stone-200 py-12 dark:border-stone-800">
        <div
          className={`mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 ${PAD} text-xs text-stone-500 sm:flex-row`}
        >
          <p>© {new Date().getFullYear()} CodeLearn</p>
          <nav className="flex items-center gap-5">
            <Link to="/verify" className="hover:text-stone-900 dark:hover:text-stone-200">
              Verify certificate
            </Link>
            <Link to="/chat" className="hover:text-stone-900 dark:hover:text-stone-200">
              AI tutor
            </Link>
          </nav>
          <p className="text-center sm:text-right">
            Designed with{' '}
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-700 underline-offset-4 hover:underline dark:text-stone-300"
            >
              Claude
            </a>
            {' · '}
            Built by{' '}
            <a
              href="https://your-portfolio-url.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-700 underline-offset-4 hover:underline dark:text-stone-300"
            >
              Sami Khan
            </a>
>>>>>>> c69f5b2 (New UI Changes)
          </p>
        </div>
      </footer>
    </div>
  )
}