import { Link } from 'react-router-dom'

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const COURSES = [
  { to: '/learn/python', label: 'Python', logo: `${DEVICON}/python/python-original.svg` },
  { to: '/learn/javascript', label: 'JavaScript', logo: `${DEVICON}/javascript/javascript-original.svg` },
  { to: '/learn/java', label: 'Java', logo: `${DEVICON}/java/java-original.svg` },
  { to: '/learn/cpp', label: 'C++', logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
]

const ArrowLeft = () => (
  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
    <path d="M16 10H4m0 0 5-5m-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-[#fcfbf8] px-6 py-16 sm:px-10 dark:bg-stone-950">
      <div className="w-full max-w-xl text-center">
        <p className="font-mono text-sm text-stone-500">Error 404</p>

        <h1 className="mt-4 font-serif text-6xl leading-none tracking-tight text-stone-900 sm:text-7xl dark:text-stone-50">
          Page not found
        </h1>

        <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-stone-600 dark:text-stone-400">
          The page you're looking for doesn't exist or may have moved. Check the address for typos, or head back to
          something that does exist.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-700 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
          >
            <ArrowLeft />
            Back to home
          </Link>
          <Link
            to="/chat"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-stone-300 px-6 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
          >
            Ask the AI tutor
          </Link>
        </div>

        <div className="mt-14 border-t border-stone-200 pt-8 dark:border-stone-800">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-400">Or start a course</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {COURSES.map(({ to, label, logo }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-200 bg-white px-3.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600"
                >
                  <img src={logo} alt="" className="h-4 w-4" loading="lazy" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}