import { useState, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useAuth } from '../context/AuthContext'

const MONACO_LANG = {
  python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp',
}

const PISTON_LANG = {
  python:     { language: 'python',     version: '3.10.0'  },
  javascript: { language: 'javascript', version: '18.15.0' },
  java:       { language: 'java',       version: '15.0.2'  },
  cpp:        { language: 'c++',        version: '10.2.0'  },
}

const STARTER_CODE = {
  python: `# Python Hello World\nprint("Hello, World!")\n\nname = "CodeLearn"\nprint(f"Welcome to {name}!")\n`,
  javascript: `// JavaScript Hello World\nconsole.log("Hello, World!");\n\nconst name = "CodeLearn";\nconsole.log(\`Welcome to \${name}!\`);\n`,
  java: `// Java Hello World\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        String name = "CodeLearn";\n        System.out.println("Welcome to " + name + "!");\n    }\n}\n`,
  cpp: `// C++ Hello World\n#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    string name = "CodeLearn";\n    cout << "Welcome to " << name << "!" << endl;\n    return 0;\n}\n`,
}

const LANG_META = {
  python:     { label: 'Python',     emoji: '🐍', gradient: 'from-emerald-500 to-teal-500', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20' },
  javascript: { label: 'JavaScript', emoji: '⚡', gradient: 'from-amber-500 to-yellow-500', color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20' },
  java:       { label: 'Java',       emoji: '☕', gradient: 'from-orange-500 to-red-500', color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/20' },
  cpp:        { label: 'C++',        emoji: '⚙️', gradient: 'from-blue-500 to-indigo-600', color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20' },
}

// ── Enhanced Icons ───────────────────────────────────────────────────
const RunIcon  = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>

// ── Enhanced AI Explain Drawer ──
function ExplainDrawer({ open, onClose, explanation, loading, error }) {
  // Render code blocks inside explanation
  const renderExplanation = (text) => {
    if (!text) return null
    const parts = text.split(/(```[\s\S]*?```)/g)
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3).split('\n')
        const lang  = lines[0].trim()
        const code  = lines.slice(1).join('\n').replace(/```$/, '').trim()
        return (
          <div key={i} className="relative group/code my-3">
            <div className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <pre className="bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-700 rounded-xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap shadow-inner">
              {lang && <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider">{lang}</div>}
              <code>{code}</code>
            </pre>
          </div>
        )
      }
      return <span key={i} className="whitespace-pre-wrap leading-relaxed">{part}</span>
    })
  }

  return (
    <>
      {/* Backdrop with blur */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Enhanced Slide-in drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-gradient-to-br from-gray-900 to-gray-950 border-l border-gray-800 z-50 flex flex-col shadow-2xl transition-all duration-300 ease-out
        ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Enhanced Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 shrink-0 bg-gradient-to-r from-gray-900 to-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-purple-500 rounded-xl blur-md opacity-50"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
                🤖
              </div>
            </div>
            <div>
              <h2 className="text-white font-bold text-base">AI Code Explanation</h2>
              <p className="text-gray-500 text-xs">Powered by Gemini 2.5 Flash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 hover:scale-110"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Enhanced Drawer content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-300 leading-relaxed custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 animate-fade-in">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-brand-500/20 border-t-brand-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-300"></div>
              </div>
              <p className="text-gray-500 text-sm font-medium">Gemini is analyzing your code...</p>
              <p className="text-gray-600 text-xs">This may take a few seconds</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl p-4 text-red-400 text-sm animate-shake">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {explanation && !loading && (
            <div className="prose prose-invert prose-sm max-w-none animate-fade-in">
              {renderExplanation(explanation)}
            </div>
          )}

          {!loading && !error && !explanation && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="relative">
                <div className="text-6xl animate-bounce">🔍</div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">Ready to understand your code?</p>
                <p className="text-gray-600 text-xs mt-1">Click "Explain with AI" to get insights</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Drawer footer */}
        {explanation && !loading && (
          <div className="px-6 py-4 border-t border-gray-800 shrink-0 bg-gray-900/50">
            <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-2">
              <span>💡</span>
              <span>Ask follow-up questions in the</span>
              <a href="/chat" className="text-brand-400 hover:text-brand-300 hover:underline transition-colors font-medium">
                AI Chat →
              </a>
            </p>
          </div>
        )}
      </div>
    </>
  )
}

// ── Enhanced Main CodeEditor ──
export default function CodeEditor({ language = 'python' }) {
  const { token } = useAuth()
  const meta = LANG_META[language] || LANG_META.python

  const [code,        setCode]        = useState(STARTER_CODE[language] || '')
  const [output,      setOutput]      = useState(null)
  const [running,     setRunning]     = useState(false)
  const [runError,    setRunError]    = useState('')
  const [copied,      setCopied]      = useState(false)

  // AI Explain drawer state
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const [explanation,  setExplanation]  = useState('')
  const [explaining,   setExplaining]   = useState(false)
  const [explainError, setExplainError] = useState('')

  const editorRef = useRef(null)
  const isDark    = document.documentElement.classList.contains('dark')

  const runCode = async () => {
    setRunning(true)
    setRunError('')
    setOutput(null)
    try {
      const res = await fetch('/api/code/run', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ language, code }),
      })
      if (!res.ok) {
        const e = await res.json()
        throw new Error(e.message || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setOutput(data)
    } catch (err) {
      setRunError(err.message || 'Failed to run code. Make sure the server is running.')
    } finally {
      setRunning(false)
    }
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetCode = () => {
    setCode(STARTER_CODE[language] || '')
    setOutput(null)
    setRunError('')
  }

  const explainCode = async () => {
    setDrawerOpen(true)
    setExplaining(true)
    setExplanation('')
    setExplainError('')
    try {
      const res = await fetch('/api/chat/explain', {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Explanation failed')
      setExplanation(data.explanation)
    } catch (err) {
      setExplainError(err.message || 'Failed to get explanation. Check your Gemini API key.')
    } finally {
      setExplaining(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 hover:shadow-2xl">

        {/* ── Enhanced Toolbar with glassmorphism ── */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* Modern traffic lights */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm hover:bg-red-600 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm hover:bg-yellow-600 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm hover:bg-green-600 transition-colors cursor-pointer" />
            </div>
            
            {/* Enhanced language badge */}
            <div className={`ml-2 px-3 py-1 rounded-lg text-xs font-bold ${meta.color} shadow-sm flex items-center gap-1.5`}>
              <span className="text-base">{meta.emoji}</span>
              <span>{meta.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Enhanced AI Explain button */}
            <button
              onClick={explainCode}
              className="group relative flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 transition-all duration-300 hover:scale-105"
            >
              <span className="text-base group-hover:scale-110 transition-transform">🤖</span>
              <span>Explain with AI</span>
            </button>

            {/* Enhanced Copy button */}
            <button 
              onClick={copyCode} 
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg btn-secondary transition-all duration-300 hover:scale-105"
            >
              <CopyIcon />
              {copied ? (
                <span className="text-green-500">Copied!</span>
              ) : (
                <span>Copy</span>
              )}
            </button>

            {/* Enhanced Reset button */}
            <button 
              onClick={resetCode} 
              className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg btn-secondary transition-all duration-300 hover:scale-105"
            >
              <ResetIcon />
              <span>Reset</span>
            </button>

            {/* Enhanced Run button */}
            <button
              onClick={runCode}
              disabled={running}
              className="group relative flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-1.5">
                {running ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <RunIcon />
                    <span>Run Code</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* ── Monaco Editor with enhanced styling ── */}
        <div className="relative">
          <Editor
            height="400px"
            language={MONACO_LANG[language] || 'plaintext'}
            value={code}
            onChange={val => setCode(val || '')}
            onMount={editor => { editorRef.current = editor }}
            theme={isDark ? 'vs-dark' : 'light'}
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
              fontLigatures: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
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
        </div>

        {/* ── Enhanced Output Panel ── */}
        <div className="bg-gradient-to-br from-gray-950 to-gray-900 border-t border-gray-800">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Output</span>
                {output?.time && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                    <span>⏱</span>
                    {parseFloat(output.time).toFixed(3)}s
                  </span>
                )}
              </div>
              {output && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              )}
            </div>
            {output && (
              <button 
                onClick={() => setOutput(null)} 
                className="text-xs text-gray-600 hover:text-gray-400 transition-all duration-300 hover:scale-105"
              >
                Clear ✕
              </button>
            )}
          </div>
          
          <div className="px-4 py-3 min-h-[100px] max-h-[260px] overflow-y-auto font-mono text-sm custom-scrollbar">
            {!running && !output && !runError && (
              <div className="flex items-center gap-2 text-gray-500 italic">
                <span className="text-yellow-500">⚠️</span>
                <span>This feature is currently under development</span>
              </div>
            )}
            
            {running && (
              <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                <div className="relative">
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-green-400 rounded-full animate-spin"></div>
                </div>
                <span>Executing {meta.label} code...</span>
              </div>
            )}
            
            {runError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-shake">
                <div className="flex items-start gap-2 text-red-400">
                  <span className="text-lg">✗</span>
                  <div>
                    <span className="font-semibold">Error:</span>
                    <pre className="mt-1 text-xs whitespace-pre-wrap">{runError}</pre>
                  </div>
                </div>
              </div>
            )}
            
            {output?.stdout && (
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed font-mono text-sm">{output.stdout}</pre>
            )}
            
            {output?.stderr && (
              <pre className="text-red-400 whitespace-pre-wrap leading-relaxed mt-2 font-mono text-sm">
                <span className="text-red-500 font-semibold">stderr: </span>
                {output.stderr}
              </pre>
            )}
            
            {output && !output.stdout && !output.stderr && (
              <p className="text-gray-500 italic flex items-center gap-2">
                <span>✓</span>
                <span>Program exited with no output.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── AI Explain Drawer ── */}
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

// Add these to your global CSS:
/*
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out;
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

.animate-bounce {
  animation: bounce 1s ease-in-out infinite;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #374151;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4B5563;
}

.btn-secondary {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600;
}
*/