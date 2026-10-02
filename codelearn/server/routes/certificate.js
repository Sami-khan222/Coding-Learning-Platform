import express from 'express'
import Certificate from '../models/Certificate.js'
import User from '../models/User.js'

const router = express.Router()

const LANG_NAMES = {
  python:     'Python',
  javascript: 'JavaScript',
  java:       'Java',
  cpp:        'C++',
}

// ── GET /api/certificate/:id ──────────────────────────────────────
// Public route — no auth needed so certs can be shared
router.get('/:id', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ uniqueId: req.params.id })

    if (!cert)
      return res.status(404).json({ message: 'Certificate not found.' })

    // Get user name for display
    const user = await User.findById(cert.userId).select('name email')

    res.json({
      certificate: {
        uniqueId:     cert.uniqueId,
        language:     cert.language,
        languageName: LANG_NAMES[cert.language] || cert.language,
        score:        cert.score,
        issuedAt:     cert.issuedAt,
        userName:     user?.name  || 'CodeLearn Student',
        userEmail:    user?.email || '',
      }
    })
  } catch (err) {
    console.error('Certificate fetch error:', err)
    res.status(500).json({ message: 'Failed to fetch certificate.' })
  }
})

export default router
