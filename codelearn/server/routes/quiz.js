import express from 'express'
import crypto from 'crypto'
import Question from '../models/Question.js'
import Certificate from '../models/Certificate.js'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

const VALID_LANGS = ['python', 'javascript', 'java', 'cpp']

// ── GET /api/quiz/:lang ───────────────────────────────────────────
// Returns 10 random questions for the language (protected)
router.get('/:lang', verifyToken, async (req, res) => {
  try {
    const { lang } = req.params

    if (!VALID_LANGS.includes(lang))
      return res.status(400).json({ message: `Invalid language: ${lang}` })

    // Fetch all questions for this language then pick 10 randomly
    const all = await Question.find({ language: lang })

    if (all.length === 0)
      return res.status(404).json({
        message: `No questions found for ${lang}. Run: node seed.js`
      })

    // Shuffle and pick 10
    const shuffled = all.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, Math.min(10, shuffled.length))

    // Send questions WITHOUT correctIndex to prevent cheating
    const safeQuestions = selected.map(q => ({
      _id:          q._id,
      questionText: q.questionText,
      options:      q.options,
      topic:        q.topic,
      difficulty:   q.difficulty,
    }))

    res.json({ questions: safeQuestions, total: safeQuestions.length, language: lang })
  } catch (err) {
    console.error('Quiz fetch error:', err)
    res.status(500).json({ message: 'Failed to fetch quiz questions.' })
  }
})

// ── POST /api/quiz/submit ─────────────────────────────────────────
// Body: { language, questionIds: [string], answers: [number] }
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { language, questionIds, answers } = req.body

    if (!language || !questionIds || !answers)
      return res.status(400).json({ message: 'language, questionIds, and answers are required.' })

    if (!VALID_LANGS.includes(language))
      return res.status(400).json({ message: 'Invalid language.' })

    if (questionIds.length !== answers.length)
      return res.status(400).json({ message: 'questionIds and answers arrays must match in length.' })

    // Fetch the actual questions with correct answers from DB
    const questions = await Question.find({ _id: { $in: questionIds } })

    if (questions.length === 0)
      return res.status(404).json({ message: 'Questions not found.' })

    // Build a map for quick lookup: id → correctIndex
    const correctMap = {}
    questions.forEach(q => { correctMap[q._id.toString()] = q.correctIndex })

    // Score: count correct answers
    let correct = 0
    questionIds.forEach((id, i) => {
      if (correctMap[id] !== undefined && answers[i] === correctMap[id]) {
        correct++
      }
    })

    const total     = questionIds.length
    const score     = Math.round((correct / total) * 100)
    const passed    = score >= 70

    // If passed → create certificate
    let certificateId = null
    if (passed) {
      // Check if user already has a cert for this language
      const existing = await Certificate.findOne({
        userId: req.user.id,
        language,
      })

      if (existing) {
        // Update score if better
        if (score > existing.score) {
          existing.score    = score
          existing.issuedAt = new Date()
          await existing.save()
          certificateId = existing.uniqueId
        } else {
          certificateId = existing.uniqueId
        }
      } else {
        // Create new certificate
        const cert = await Certificate.create({
          userId:   req.user.id,
          language,
          score,
          uniqueId: crypto.randomUUID(),
          issuedAt: new Date(),
        })
        certificateId = cert.uniqueId
      }

      // Update user progress
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { progress: { language } },   // remove old entry
      })
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          progress: {
            language,
            quizScore:   score,
            certified:   true,
            completedAt: new Date(),
          }
        }
      })
    }

    res.json({
      passed,
      score,
      correct,
      total,
      ...(passed && { certificateId }),
    })
  } catch (err) {
    console.error('Quiz submit error:', err)
    res.status(500).json({ message: 'Failed to submit quiz.' })
  }
})

export default router
