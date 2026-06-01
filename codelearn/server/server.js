import express      from 'express'
import cors         from 'cors'
import dotenv       from 'dotenv'
import connectDB    from './config/db.js'

// Routes
import authRoutes        from './routes/auth.js'
import codeRoutes        from './routes/code.js'
import quizRoutes        from './routes/quiz.js'
import certificateRoutes from './routes/certificate.js'
import chatRoutes        from './routes/chat.js'
import videosRoutes      from './routes/videos.js'

// Load env vars first
dotenv.config()

// Connect to MongoDB
connectDB()

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Request logger (dev only) ─────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes)
app.use('/api/code',        codeRoutes)
app.use('/api/quiz',        quizRoutes)
app.use('/api/certificate', certificateRoutes)
app.use('/api/chat',        chatRoutes)
app.use('/api/videos',      videosRoutes)

// ── Health check ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    message:   'CodeLearn API is running',
    timestamp: new Date().toISOString(),
    version:   '1.0.0',
  })
})

// ── 404 handler ───────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'API route not found.' })
})

// ── Global error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message,
  })
})

// ── Start server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('')
  console.log('  🚀 CodeLearn API running')
  console.log(`  📡 http://localhost:${PORT}`)
  console.log(`  🔍 Health: http://localhost:${PORT}/api/health`)
  console.log('')
})
