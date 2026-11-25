import { useState, useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useAuth } from '../context/AuthContext'

const API = 'https://coding-learning-platform-4okh.onrender.com/api'
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'

const MONACO_LANG = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
}

const STARTER_CODE = {
  python: `# Python Hello World\nprint("Hello, World!")\n\nname = "CodeLearn"\nprint(f"Welcome to {name}!")\n`,
  javascript: `// JavaScript Hello World\nconsole.log("Hello, World!");\n\nconst name = "CodeLearn";\nconsole.log(\`Welcome to \${name}!\`);\n`,
  java: `// Java Hello World\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        String name = "CodeLearn";\n        System.out.println("Welcome to " + name + "!");\n    }\n}\n`,
  cpp: `// C++ Hello World\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    string name = "CodeLearn";\n    cout << "Welcome to " << name << "!" << endl;\n    return 0;\n}\n`,
}

const LANG_META = {
  python: { label: 'Python', file: 'main.py', logo: `${DEVICON}/python/python-original.svg` },
  javascript: { label: 'JavaScript', file: 'index.js', logo: `${DEVICON}/javascript/javascript-original.svg` },
  java: { label: 'Java', file: 'Main.java', logo: `${DEVICON}/java/java-original.svg` },
  cpp: { label: 'C++', file: 'main.cpp', logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
}

/* ───────────── Helpers ───────────── */

// Reactive version of "is the <html> element in dark mode?"
function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const el = document.documentElement
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')))
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

// Parse JSON safely: servers sometimes return an HTML error page
async function readJson(res) {
  try {
    return await res.json()
  } catch {
    return {}
  }
}

/* ───────────── Icons ───────────── */

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const RunIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
    <path d="M7 4.5v15l12-7.5-12-7.5Z" />
  </svg>
)
const CopyIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h8" />
  </svg>
)
const CheckIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
const ResetIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <path d="M4 5v5h5" />
    <path d="M4.6 15a8 8 0 1 0 1.2-7.6L4 10" />
  </svg>
)
const CloseIcon = () => (
  <svg {...iconProps} className="h-4 w-4">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
const SparkleIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7-5.6-1.9L10.1 9 12 3.5Z" />
    <path d="M19 3v3M20.5 4.5h-3" />
  </svg>
)
const AlertIcon = () => (
  <svg {...iconProps} className="mt-0.5 h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.2v.1" />
  </svg>
)

/* ───────────── Shared button styles ───────────── */

const btnBase =
  'inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors sm:flex-none'
const btnGhost = `${btnBase} border border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800`

/* ───────────── AI Explain drawer ───────────── */

function ExplanationBody({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3).split('\n')
      const lang = lines[0].trim()
      const code = lines.slice(1).join('\n').replace(/```$/, '').trim()
      return (
        <div key={i} className="group/code relative my-4 overflow-hidden rounded-lg border border-stone-800 bg-stone-950">
          <div className="flex items-center justify-between border-b border-stone-800 px-3.5 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{lang || 'code'}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(code)}
              className="text-[11px] font-medium text-stone-400 transition-colors hover:text-white"
            >
              Copy
            </button>
          </div>
          <pre className="overflow-x-auto px-4 py-3.5 font-mono text-xs leading-relaxed text-stone-200">
            <code>{code}</code>
          </pre>
        </div>
      )
    }
    return (
      <span key={i} className="whitespace-pre-wrap leading-relaxed">
        {part}
      </span>
    )
  })
}

function ExplainDrawer({ open, onClose, explanation, loading, error }) {
  // Escape to close + lock page scroll while open
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-40 bg-stone-950/40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="AI code explanation"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-stone-200 bg-[#fcfbf8] shadow-2xl transition-transform duration-300 ease-out sm:w-[480px] dark:border-stone-800 dark:bg-stone-950 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-stone-200 px-5 py-4 dark:border-stone-800">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-900 text-indigo-300 dark:bg-stone-100 dark:text-indigo-600">
              <SparkleIcon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-stone-900 dark:text-stone-50">Code explanation</h2>
              <p className="text-xs text-stone-500">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 text-sm text-stone-700 dark:text-stone-300">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100" />
              <div>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Reading your code…</p>
                <p className="mt-1 text-xs text-stone-500">This usually takes a few seconds.</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          {explanation && !loading && <ExplanationBody text={explanation} />}

          {!loading && !error && !explanation && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200">Nothing to explain yet</p>
              <p className="max-w-xs text-xs text-stone-500">Press "Explain" in the editor toolbar to get a walkthrough of your code.</p>
            </div>
          )}
        </div>

        {explanation && !loading && (
          <footer className="shrink-0 border-t border-stone-200 px-5 py-3.5 text-center text-xs text-stone-500 dark:border-stone-800">
            Have a follow-up?{' '}
            <a
              href="/chat"
              className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-stone-100"
            >
              Continue in the AI tutor
            </a>
          </footer>
        )}
      </aside>
    </>
  )
}

/* ───────────── Code editor ───────────── */

export default function CodeEditor({ language = 'python' }) {
  const { token } = useAuth()
  const isDark = useIsDark()
  const meta = LANG_META[language] || LANG_META.python

  const [code, setCode] = useState(STARTER_CODE[language] || '')
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)
  const [runError, setRunError] = useState('')
  const [copied, setCopied] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [explaining, setExplaining] = useState(false)
  const [explainError, setExplainError] = useState('')

  const editorRef = useRef(null)

  // Start fresh whenever the language changes
  useEffect(() => {
    setCode(STARTER_CODE[language] || '')
    setOutput(null)
    setRunError('')
  }, [language])

  const runCode = async () => {
    setRunning(true)
    setRunError('')
    setOutput(null)
    try {
      const res = await fetch(`${API}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code }),
      })
      const data = await readJson(res)
      if (!res.ok) throw new Error(data.message || `Server error: ${res.status}`)
      setOutput(data)
    } catch (err) {
      setRunError(err.message || 'Failed to run code. Make sure the server is running.')
    } finally {
      setRunning(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const resetCode = () => {
    setCode(STARTER_CODE[language] || '')
    setOutput(null)
    setRunError('')
  }

  const explainCode = async () => {
    setDrawerOpen(true)
    setExplanation('')
    setExplainError('')

    if (!token) {
      setExplainError('Please log in to use AI explanations.')
      return
    }

    setExplaining(true)
    try {
      const res = await fetch(`${API}/chat/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      })
      const data = await readJson(res)
      if (!res.ok) throw new Error(data.message || 'Explanation failed')
      setExplanation(data.explanation)
    } catch (err) {
      setExplainError(err.message || 'Failed to get an explanation. Please try again.')
    } finally {
      setExplaining(false)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-stone-800 dark:bg-stone-900">
        {/* ───── Toolbar ───── */}
        <div className="flex flex-col gap-3 border-b border-stone-200 bg-stone-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-stone-800 dark:bg-stone-900">
          {/* Left: file tab */}
          <div className="flex items-center gap-2.5">
            <img src={meta.logo} alt="" className="h-4 w-4" />
            <span className="font-mono text-xs text-stone-700 dark:text-stone-300">{meta.file}</span>
            <span className="hidden text-xs text-stone-400 sm:inline">· {meta.label}</span>
          </div>

          {/* Right: actions */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={explainCode}
              className={`${btnBase} border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20`}
            >
              <SparkleIcon />
              Explain
            </button>

            <button onClick={copyCode} className={btnGhost}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </button>

            <button onClick={resetCode} className={btnGhost}>
              <ResetIcon />
              Reset
            </button>

            <button
              onClick={runCode}
              disabled={running}
              className={`${btnBase} bg-stone-900 font-semibold text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white`}
            >
              {running ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                  Running…
                </>
              ) : (
                <>
                  <RunIcon />
                  Run
                </>
              )}
            </button>
          </div>
        </div>

        {/* ───── Monaco ───── */}
        <Editor
          height="400px"
          language={MONACO_LANG[language] || 'plaintext'}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={(editor) => {
            editorRef.current = editor
          }}
          theme={isDark ? 'vs-dark' : 'light'}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            tabSize: 4,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            automaticLayout: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
          }}
        />

        {/* ───── Output ───── */}
        <div className="border-t border-stone-200 bg-stone-950 dark:border-stone-800">
          <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500">Output</span>
              {output?.time && (
                <span className="font-mono text-[11px] text-stone-400">{parseFloat(output.time).toFixed(3)}s</span>
              )}
              {output && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Done
                </span>
              )}
            </div>

            {output && (
              <button
                onClick={() => setOutput(null)}
                className="text-[11px] font-medium text-stone-500 transition-colors hover:text-stone-300"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-[260px] min-h-[100px] overflow-y-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
            {!running && !output && !runError && (
              <p className="text-stone-500">Run your code to see the output here.</p>
            )}

            {running && (
              <div className="flex items-center gap-3 text-stone-400">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-700 border-t-emerald-400" />
                <span>Executing {meta.label} code…</span>
              </div>
            )}

            {runError && (
              <div className="rounded-lg border border-rose-500/25 bg-rose-500/[0.07] px-3.5 py-3 text-rose-300">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">Error</p>
                <pre className="mt-1 whitespace-pre-wrap text-xs">{runError}</pre>
              </div>
            )}

            {output?.stdout && <pre className="whitespace-pre-wrap text-emerald-300">{output.stdout}</pre>}

            {output?.stderr && (
              <pre className="mt-2 whitespace-pre-wrap text-rose-300">
                <span className="font-semibold text-rose-400">stderr: </span>
                {output.stderr}
              </pre>
            )}

            {output && !output.stdout && !output.stderr && (
              <p className="italic text-stone-500">Program exited with no output.</p>
            )}
          </div>
        </div>
      </div>

      <ExplainDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        explanation={explanation}
        loading={explaining}
        error={explainError}
      />
    </>
  )
}