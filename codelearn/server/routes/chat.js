import express                        from 'express'
import { GoogleGenerativeAI }         from '@google/generative-ai'
import verifyToken                    from '../middleware/verifyToken.js'
import ChatHistory                    from '../models/ChatHistory.js'

const router = express.Router()

const VALID_LANGS = ['python', 'javascript', 'java', 'cpp', 'general']

const LANG_NAMES = {
  python: 'Python', javascript: 'JavaScript',
  java: 'Java', cpp: 'C++', general: 'programming',
}

// ── Init Gemini ───────────────────────────────────────────────────
let geminiModel = null

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) return null
  if (!geminiModel) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }
  return geminiModel
}

// ── Helper: save messages to DB ───────────────────────────────────
const saveMessages = async (userId, language, userMsg, aiMsg) => {
  try {
    let history = await ChatHistory.findOne({ userId, language })
    if (!history) {
      history = new ChatHistory({ userId, language, messages: [] })
    }
    history.messages.push(
      { role: 'user',      content: userMsg, timestamp: new Date() },
      { role: 'assistant', content: aiMsg,   timestamp: new Date() }
    )
    // Keep only last 100 messages per language to save DB space
    if (history.messages.length > 100) {
      history.messages = history.messages.slice(-100)
    }
    await history.save()
  } catch (err) {
    console.error('Chat history save error:', err.message)
    // Non-critical — don't fail the request if history save fails
  }
}

// ── POST /api/chat/message ────────────────────────────────────────
router.post('/message', verifyToken, async (req, res) => {
  try {
    const { message, language = 'general' } = req.body

    if (!message?.trim())
      return res.status(400).json({ message: 'Message is required.' })

    const model = getModel()
    if (!model)
      return res.status(503).json({
        message: 'AI service not configured. Add GEMINI_API_KEY to server/.env'
      })

    const langName = LANG_NAMES[language] || language

    const systemPrompt = `You are a friendly and encouraging coding tutor specializing in ${langName} programming. 
Follow these rules:
- Give short, clear answers (max 3-4 paragraphs)
- Use simple language that beginners can understand
- Include small code examples when helpful, wrapped in triple backticks with the language name
- If asked something unrelated to coding, politely redirect to coding topics
- Be encouraging and positive`

    const fullPrompt = `${systemPrompt}\n\nStudent question: ${message}`

    const result = await model.generateContent(fullPrompt)
    const reply  = result.response.text()

    // Save to history (non-blocking)
    saveMessages(req.user.id, language, message, reply)

    res.json({ reply })
  } catch (err) {
    console.error('Chat message error:', err.message)
    if (err.message?.includes('API_KEY'))
      return res.status(401).json({ message: 'Invalid Gemini API key. Check your .env file.' })
    if (err.message?.includes('quota') || err.message?.includes('429'))
      return res.status(429).json({ message: 'Gemini API quota exceeded. Try again later.' })
    res.status(500).json({ message: 'AI service error. Please try again.' })
  }
})

// ── POST /api/chat/explain ────────────────────────────────────────
router.post('/explain', verifyToken, async (req, res) => {
  try {
    const { code, language = 'general' } = req.body

    if (!code?.trim())
      return res.status(400).json({ message: 'Code is required.' })

    if (code.length > 5000)
      return res.status(400).json({ message: 'Code too long. Max 5000 characters.' })

    const model = getModel()
    if (!model)
      return res.status(503).json({
        message: 'AI service not configured. Add GEMINI_API_KEY to server/.env'
      })

    const langName = LANG_NAMES[language] || language

    const prompt = `You are a coding tutor. Explain the following ${langName} code in simple, beginner-friendly terms.

Rules:
- Explain what the code does overall in 1-2 sentences first
- Then go line by line (or block by block for longer code)
- Use plain English — avoid jargon
- Point out any important concepts being used
- Keep it concise

Code to explain:
\`\`\`${language}
${code}
\`\`\`

Explanation:`

    const result      = await model.generateContent(prompt)
    const explanation = result.response.text()

    // Save explain interaction to chat history
    saveMessages(
      req.user.id,
      language,
      `[Code explanation request]\n\`\`\`${language}\n${code}\n\`\`\``,
      explanation
    )

    res.json({ explanation })
  } catch (err) {
    console.error('Chat explain error:', err.message)
    if (err.message?.includes('quota') || err.message?.includes('429'))
      return res.status(429).json({ message: 'Gemini API quota exceeded. Try again later.' })
    res.status(500).json({ message: 'AI service error. Please try again.' })
  }
})

// ── GET /api/chat/history?language=python ─────────────────────────
router.get('/history', verifyToken, async (req, res) => {
  try {
    const { language = 'general' } = req.query

    const history = await ChatHistory.findOne({
      userId: req.user.id,
      language,
    })

    if (!history) return res.json({ messages: [] })

    // Return last 20 messages
    const messages = history.messages.slice(-20)
    res.json({ messages })
  } catch (err) {
    console.error('Chat history error:', err.message)
    res.status(500).json({ message: 'Failed to fetch chat history.' })
  }
})

// to check api key is loaded or not
console.log(
  "Gemini Key Loaded:",
  !!process.env.GEMINI_API_KEY
);

// ── DELETE /api/chat/history ─ clear history ──────────────────────
router.delete('/history', verifyToken, async (req, res) => {
  try {
    const { language = 'general' } = req.query
    await ChatHistory.findOneAndUpdate(
      { userId: req.user.id, language },
      { $set: { messages: [] } }
    )
    res.json({ message: 'Chat history cleared.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear history.' })
  }
})

export default router
