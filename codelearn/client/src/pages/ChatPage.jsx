import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

const LANGUAGES = [
  { value: 'general',    label: '💬 General',    placeholder: 'Ask anything about coding...', gradient: 'from-purple-500 to-pink-500' },
  { value: 'python',     label: '🐍 Python',     placeholder: 'Ask about Python...', gradient: 'from-emerald-500 to-teal-500' },
  { value: 'javascript', label: '⚡ JavaScript', placeholder: 'Ask about JavaScript...', gradient: 'from-amber-500 to-yellow-500' },
  { value: 'java',       label: '☕ Java',        placeholder: 'Ask about Java...', gradient: 'from-orange-500 to-red-500' },
  { value: 'cpp',        label: '⚙️ C++',        placeholder: 'Ask about C++...', gradient: 'from-blue-500 to-indigo-500' },
]

// ── Typing indicator with enhanced animation ────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4 animate-fade-in-up">
      <div className="relative">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-base shadow-lg">
          🤖
        </div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
      </div>
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl rounded-bl-sm px-5 py-3">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-brand-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Enhanced Message bubble with syntax highlighting ─────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'

  // Enhanced render with better code formatting
  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3).split('\n')
        const lang = lines[0].trim()
        const code = lines.slice(1).join('\n').replace(/```$/, '').trim()
        return (
          <div key={i} className="relative group mt-2 mb-2">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-700 rounded-xl p-4 overflow-x-auto text-xs font-mono text-emerald-400 whitespace-pre-wrap shadow-inner">
              {lang && <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">{lang}</div>}
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      // Enhanced inline code rendering
      const inlineParts = part.split(/(`[^`]+`)/g)
      return (
        <span key={i}>
          {inlineParts.map((p, j) =>
            p.startsWith('`') && p.endsWith('`')
              ? <code key={j} className="bg-gray-800 text-emerald-300 px-1.5 py-0.5 rounded-md text-xs font-mono border border-gray-700">{p.slice(1, -1)}</code>
              : <span key={j} className="leading-relaxed">{p}</span>
          )}
        </span>
      )
    })
  }

  return (
    <div className={`flex items-end gap-3 mb-5 animate-fade-in-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Enhanced Avatar with gradient */}
      {!isUser && (
        <div className="relative group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-base shadow-lg group-hover:scale-110 transition-transform duration-300">
            🤖
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
      )}
      {isUser && (
        <div className="relative group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-base shadow-lg group-hover:scale-110 transition-transform duration-300">
            👤
          </div>
        </div>
      )}

      {/* Enhanced Bubble with gradient borders */}
      <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg transition-all duration-300 hover:shadow-xl
        ${isUser
          ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-br-sm'
          : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700 text-gray-200 rounded-bl-sm hover:border-brand-500/30'
        }`}
      >
        <div className="prose prose-invert max-w-none">
          {renderContent(msg.content)}
        </div>
        <div className={`text-xs mt-2 flex items-center gap-1 ${isUser ? 'text-brand-200' : 'text-gray-500'}`}>
          <span>🕐</span>
          {msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : ''}
        </div>
      </div>
    </div>
  )
}

// ── Enhanced Send icon with animation ────────────────────────────
function SendIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  )
}

// ── Main ChatPage with enhanced UI ─────────────────────────────────
export default function ChatPage() {
  const { token, user } = useAuth()

  const [language,    setLanguage]    = useState('general')
  const [messages,    setMessages]    = useState([])
  const [input,       setInput]       = useState('')
  const [typing,      setTyping]      = useState(false)
  const [loadingHist, setLoadingHist] = useState(true)
  const [error,       setError]       = useState('')
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  const currentLang = LANGUAGES.find(l => l.value === language) || LANGUAGES[0]

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Load chat history when language changes
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHist(true)
      setMessages([])
      setError('')
      try {
        const res  = await fetch(`https://coding-learning-platform-4okh.onrender.com/api/chat/history?language=${language}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) setMessages(data.messages || [])
      } catch {
        // History load failure is non-critical
      } finally {
        setLoadingHist(false)
      }
    }
    fetchHistory()
  }, [language, token])

  // Send message
  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || typing) return

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setError('')

    try {
      const res  = await fetch('https://coding-learning-platform-4okh.onrender.com/api/chat/message', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ message: text, language }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to get response')

      const aiMsg = { role: 'assistant', content: data.reply, timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, aiMsg])
    } catch (err) {
      setError(err.message)
      // Remove the user message if request failed
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setTyping(false)
      inputRef.current?.focus()
    }
  }, [input, typing, token, language])

  // Send on Enter (Shift+Enter for newline)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Clear history
  const clearHistory = async () => {
    if (!window.confirm('Clear all chat history for this language?')) return
    try {
      await fetch(`https://coding-learning-platform-4okh.onrender.com/api/chat/history?language=${language}`, {
        method:  'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages([])
    } catch {
      alert('Failed to clear history.')
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">

      {/* ── Enhanced Top bar with glassmorphism ── */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
              🤖
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-gray-900"></div>
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-none bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Coding Tutor
            </h1>
            <p className="text-gray-500 text-xs mt-1">Powered by Gemini 2.5 Flash</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2 py-1 bg-green-500/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-500 font-medium">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Enhanced Language selector with gradient border */}
          <div className="relative">
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="appearance-none text-sm bg-gray-800 border border-gray-700 text-gray-300 rounded-xl px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer hover:border-brand-500 transition-all duration-300"
              style={{ backgroundImage: `linear-gradient(135deg, ${currentLang.gradient})` }}
            >
              {LANGUAGES.map(l => (
                <option key={l.value} value={l.value} className="bg-gray-800">{l.label}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▼
            </div>
          </div>

          {/* Enhanced Clear history button */}
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="group text-xs text-gray-500 hover:text-red-400 transition-all duration-300 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-red-500/10"
              title="Clear chat history"
            >
              <span className="flex items-center gap-1">
                🗑️ <span className="hidden sm:inline">Clear</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Messages area with custom scrollbar ── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-0 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

        {/* Loading history with enhanced spinner */}
        {loadingHist && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300"></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">Loading conversation history...</p>
          </div>
        )}

        {/* Enhanced Welcome message */}
        {!loadingHist && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center animate-fade-in-up">
            <div className="relative mb-6">
              <div className="text-7xl sm:text-8xl animate-bounce">🤖</div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
              AI Coding Tutor
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-sm mb-8 leading-relaxed">
              Ask me anything about {currentLang.label.split(' ')[1] || 'coding'} —
              syntax, debugging, concepts, or code examples.
            </p>
            
            {/* Enhanced Suggested questions with gradients */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {[
                'What is a for loop?',
                'How do I define a function?',
                'Explain OOP concepts',
                'What are common errors?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="group text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-400 hover:border-brand-500 hover:text-brand-400 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {!loadingHist && messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {/* Typing indicator */}
        {typing && <TypingIndicator />}

        {/* Enhanced Error message */}
        {error && (
          <div className="flex justify-center mb-4 animate-shake">
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-400 text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Enhanced Input bar with glassmorphism ── */}
      <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 px-4 sm:px-6 py-4 shrink-0">
        <div className="max-w-5xl mx-auto flex gap-3 items-end">
          <div className="flex-1 relative group">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentLang.placeholder}
              rows={1}
              className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-gray-200 placeholder-gray-500 rounded-2xl px-4 py-3 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none max-h-32 overflow-y-auto leading-relaxed transition-all duration-300"
              style={{ minHeight: '48px' }}
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {input.length}/500
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!input.trim() || typing}
            className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0"
            aria-label="Send message"
          >
            {typing
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <SendIcon />
            }
          </button>
        </div>
        
        <p className="text-center text-gray-700 text-xs mt-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1">⌨️ Enter to send</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="inline-flex items-center gap-1">⇧ Shift+Enter for new line</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
          <span>⚡ Gemini 2.5 Flash</span>
        </p>
      </div>
    </div>
  )
}

// Add these animations to your global CSS or Tailwind config:
/*
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}
*/