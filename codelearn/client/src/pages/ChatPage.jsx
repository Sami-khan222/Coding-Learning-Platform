import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'https://coding-learning-platform-4okh.onrender.com/api'
const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons'
const MAX_LEN = 500

const LANGUAGES = [
  { value: 'general', label: 'General', name: 'coding', placeholder: 'Ask anything about coding…', logo: null },
  { value: 'python', label: 'Python', name: 'Python', placeholder: 'Ask about Python…', logo: `${DEVICON}/python/python-original.svg` },
  { value: 'javascript', label: 'JavaScript', name: 'JavaScript', placeholder: 'Ask about JavaScript…', logo: `${DEVICON}/javascript/javascript-original.svg` },
  { value: 'java', label: 'Java', name: 'Java', placeholder: 'Ask about Java…', logo: `${DEVICON}/java/java-original.svg` },
  { value: 'cpp', label: 'C++', name: 'C++', placeholder: 'Ask about C++…', logo: `${DEVICON}/cplusplus/cplusplus-original.svg` },
]

const SUGGESTIONS = [
  'What is a for loop?',
  'How do I define a function?',
  'Explain OOP concepts',
  'What are common errors?',
]

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

const SendIcon = () => (
  <svg {...iconProps} className="h-4 w-4">
    <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
  </svg>
)
const TrashIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
  </svg>
)
const SparkleIcon = ({ className = 'h-4 w-4' }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7-5.6-1.9L10.1 9 12 3.5Z" />
    <path d="M19 3v3M20.5 4.5h-3" />
  </svg>
)
const ChevronIcon = () => (
  <svg {...iconProps} className="h-3.5 w-3.5">
    <path d="m6 9 6 6 6-6" />
  </svg>
)
const AlertIcon = () => (
  <svg {...iconProps} className="h-4 w-4 shrink-0">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16.2v.1" />
  </svg>
)

/* ───────────── Avatars ───────────── */

function TutorAvatar({ className = 'h-8 w-8' }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-md bg-stone-900 text-indigo-300 dark:bg-stone-100 dark:text-indigo-600 ${className}`}
    >
      <SparkleIcon className="h-4 w-4" />
    </span>
  )
}

function UserAvatar({ name }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-stone-100 text-xs font-semibold text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
      {name?.charAt(0).toUpperCase() || 'U'}
    </span>
  )
}

/* ───────────── Typing indicator ───────────── */

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3" role="status" aria-label="Tutor is typing">
      <TutorAvatar />
      <div className="rounded-xl rounded-bl-sm border border-stone-200 bg-white px-4 py-3.5 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-stone-400"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────── Message rendering ───────────── */

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-stone-800 bg-stone-950">
      <div className="flex items-center justify-between border-b border-stone-800 px-3.5 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{lang || 'code'}</span>
        <button onClick={copy} className="text-[11px] font-medium text-stone-400 transition-colors hover:text-white">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-xs leading-relaxed text-stone-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MessageContent({ text }) {
  const parts = text.split(/(```[\s\S]*?```)/g)
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3).split('\n')
      const lang = lines[0].trim()
      const code = lines.slice(1).join('\n').replace(/```$/, '').trim()
      return <CodeBlock key={i} lang={lang} code={code} />
    }
    return (
      <span key={i}>
        {part.split(/(`[^`]+`)/g).map((p, j) =>
          p.startsWith('`') && p.endsWith('`') && p.length > 2 ? (
            <code
              key={j}
              className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-[12px] text-stone-800 dark:bg-stone-800 dark:text-stone-200"
            >
              {p.slice(1, -1)}
            </code>
          ) : (
            <span key={j} className="whitespace-pre-wrap">
              {p}
            </span>
          ),
        )}
      </span>
    )
  })
}

function MessageBubble({ msg, userName }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {isUser ? <UserAvatar name={userName} /> : <TutorAvatar />}

      <div className={`flex max-w-[85%] flex-col sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-br-sm bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
              : 'rounded-bl-sm border border-stone-200 bg-white text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200'
          }`}
        >
          <MessageContent text={msg.content} />
        </div>
        {msg.timestamp && (
          <p className="mt-1.5 px-1 text-[10px] text-stone-400">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}

/* ───────────── Page ───────────── */

export default function ChatPage() {
  const { token, user } = useAuth()

  const [language, setLanguage] = useState('general')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loadingHist, setLoadingHist] = useState(Boolean(token))
  const [error, setError] = useState('')

  const endRef = useRef(null)
  const inputRef = useRef(null)

  const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0]

  const resizeInput = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 128) + 'px'
  }

  // Keep the newest message in view
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  // Load history for the selected language
  useEffect(() => {
    setMessages([])
    setError('')
    if (!token) {
      setLoadingHist(false)
      return
    }

    const ctrl = new AbortController()
    ;(async () => {
      setLoadingHist(true)
      try {
        const res = await fetch(`${API}/chat/history?language=${encodeURIComponent(language)}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) setMessages(data.messages || [])
      } catch {
        // History is non-critical
      } finally {
        if (!ctrl.signal.aborted) setLoadingHist(false)
      }
    })()
    return () => ctrl.abort()
  }, [language, token])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || typing || !token) return

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    requestAnimationFrame(resizeInput)
    setTyping(true)
    setError('')

    try {
      const res = await fetch(`${API}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, language }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to get a response')

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      // Roll back the optimistic message and give the text back to the user
      setMessages((prev) => prev.slice(0, -1))
      setInput(text)
      requestAnimationFrame(resizeInput)
    } finally {
      setTyping(false)
      inputRef.current?.focus()
    }
  }, [input, typing, token, language])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history for this language?')) return
    setError('')
    try {
      const res = await fetch(`${API}/chat/history?language=${encodeURIComponent(language)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to clear history.')
      setMessages([])
    } catch (err) {
      setError(err.message || 'Failed to clear history.')
    }
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-[#fcfbf8] dark:bg-stone-950">
      {/* ───── Top bar ───── */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-stone-200 px-4 py-3 sm:px-6 dark:border-stone-800">
        <div className="flex min-w-0 items-center gap-3">
          <TutorAvatar className="h-9 w-9" />
          <div className="min-w-0">
            <h1 className="truncate font-serif text-lg leading-tight tracking-tight text-stone-900 dark:text-stone-50">
              AI tutor
            </h1>
            <p className="truncate text-[11px] text-stone-500">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <label htmlFor="chat-language" className="sr-only">
              Language
            </label>
            <select
              id="chat-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-md border border-stone-300 bg-white pl-3 pr-8 text-xs font-medium text-stone-800 transition-colors hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:focus-visible:ring-stone-100/30"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400">
              <ChevronIcon />
            </span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              title="Clear chat history"
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
            >
              <TrashIcon />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </header>

      {/* ───── Messages ───── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {loadingHist && (
            <div className="flex flex-col items-center justify-center py-20" role="status">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-900 dark:border-stone-700 dark:border-t-stone-100" />
              <p className="mt-4 text-xs text-stone-500">Loading conversation…</p>
            </div>
          )}

          {!loadingHist && messages.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center sm:py-16">
              {currentLang.logo ? (
                <img src={currentLang.logo} alt="" className="h-12 w-12" />
              ) : (
                <TutorAvatar className="h-12 w-12" />
              )}

              <h2 className="mt-6 font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl dark:text-stone-50">
                What are you working on?
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                Ask about {currentLang.name} syntax, a bug you can't figure out, or a concept that isn't clicking.
              </p>

              <div className="mt-8 grid w-full max-w-md gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q)
                      inputRef.current?.focus()
                    }}
                    className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-left text-sm text-stone-700 transition-colors hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-600"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loadingHist &&
            messages.map((msg, i) => (
              <MessageBubble key={`${msg.timestamp || ''}-${i}`} msg={msg} userName={user?.name} />
            ))}

          {typing && <TypingIndicator />}

          {error && (
            <div
              role="alert"
              className="mx-auto flex max-w-full items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>

      {/* ───── Input ───── */}
      <div className="shrink-0 border-t border-stone-200 px-4 py-3.5 sm:px-6 dark:border-stone-800">
        {!token ? (
          <p className="mx-auto max-w-3xl text-center text-sm text-stone-600 dark:text-stone-400">
            <Link to="/login" className="font-medium text-stone-900 underline underline-offset-4 dark:text-stone-100">
              Log in
            </Link>{' '}
            to chat with the AI tutor and save your conversations.
          </p>
        ) : (
          <>
            <div className="mx-auto flex max-w-3xl items-end gap-2.5">
              <div className="relative flex-1">
                <label htmlFor="chat-input" className="sr-only">
                  Message
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onInput={resizeInput}
                  onKeyDown={handleKeyDown}
                  placeholder={currentLang.placeholder}
                  rows={1}
                  maxLength={MAX_LEN}
                  className="w-full resize-none overflow-y-auto rounded-xl border border-stone-300 bg-white px-4 py-3 pr-16 text-sm leading-relaxed text-stone-900 placeholder-stone-400 transition-colors focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-stone-300"
                  style={{ minHeight: '46px', maxHeight: '128px' }}
                />
                {input.length > MAX_LEN * 0.8 && (
                  <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] tabular-nums text-stone-400">
                    {input.length}/{MAX_LEN}
                  </span>
                )}
              </div>

              <button
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                aria-label="Send message"
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-stone-900 text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {typing ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-stone-900/30 dark:border-t-stone-900" />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>

            <p className="mx-auto mt-2.5 hidden max-w-3xl text-center text-[11px] text-stone-400 sm:block">
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
                Enter
              </kbd>{' '}
              to send ·{' '}
              <kbd className="rounded border border-stone-300 bg-white px-1.5 py-0.5 font-mono text-[10px] text-stone-600 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300">
                Shift + Enter
              </kbd>{' '}
              for a new line
            </p>
          </>
        )}
      </div>
    </div>
  )
}