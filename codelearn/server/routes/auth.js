import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// ── Helper: sign JWT ──────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

// ── POST /api/auth/register ───────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' })

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing)
      return res.status(409).json({ message: 'An account with this email already exists.' })

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await User.create({ name, email, passwordHash })
    const token = signToken(user)

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: user.toJSON(),   // passwordHash stripped by toJSON()
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration.' })
  }
})

// ── POST /api/auth/login ──────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' })

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password.' })

    const token = signToken(user)

    res.json({
      message: 'Login successful.',
      token,
      user: user.toJSON(),
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login.' })
  }
})

// ── GET /api/auth/me ─ get current user (protected) ───────────────
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user: user.toJSON() })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
