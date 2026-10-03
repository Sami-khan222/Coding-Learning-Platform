import express from 'express'
import rateLimit from 'express-rate-limit'
import Certificate from '../models/Certificate.js'
import User from '../models/User.js'

const router = express.Router()

const LANG_NAMES = {
  python:     'Python',
  javascript: 'JavaScript',
  java:       'Java',
  cpp:        'C++',
}

// ── NEW: GET /api/certificate/verify/:id ──────────────────────────
// Public. Returns only what a verifier needs (no email).
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { valid: false, message: 'Too many attempts. Try again later.' },
})

router.get('/verify/:id', verifyLimiter, async (req, res) => {
  try {
    const id = String(req.params.id).trim()

    if (!id || id.length > 100) {
      return res.status(400).json({ valid: false, message: 'Invalid certificate ID.' })
    }

    const cert = await Certificate.findOne({ uniqueId: id })

    if (!cert || cert.revoked) {
      return res.status(404).json({ valid: false, message: 'No valid certificate found with this ID.' })
    }

    const user = await User.findById(cert.userId).select('name')

    res.json({
      valid: true,
      uniqueId:     cert.uniqueId,
      userName:     user?.name || 'CodeLearn Student',
      languageName: LANG_NAMES[cert.language] || cert.language,
      score:        cert.score,
      issuedAt:     cert.issuedAt,
    })
  } catch (err) {
    console.error('Certificate verify error:', err)
    res.status(500).json({ valid: false, message: 'Verification failed. Try again.' })
  }
})



// ── GET /api/certificate/:id ──────────────────────────────────────
// Public route — no auth needed so certs can be shared
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ uniqueId: req.params.id })

    if (!cert)
      return res.status(404).json({ message: 'Certificate not found.' })

    // Get user name for display
    const user = await User.findById(cert.userId).select('name')

    res.json({
      certificate: {
        uniqueId:     cert.uniqueId,
        language:     cert.language,
        languageName: LANG_NAMES[cert.language] || cert.language,
        score:        cert.score,
        issuedAt:     cert.issuedAt,
        userName:     user?.name  || 'CodeLearn Student',
        
      }
    })
  } catch (err) {
    console.error('Certificate fetch error:', err)
    res.status(500).json({ message: 'Failed to fetch certificate.' })
  }
})

export default router
