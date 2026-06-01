import express from 'express'
import axios   from 'axios'

const router = express.Router()

const JUDGE0_MAP = {
  python:     54,
  javascript: 63,
  java:       62,
  cpp:        76,
}

const MAX_CODE_LENGTH = 10_000

router.post('/run', async (req, res) => {
  try {
    const { language, code } = req.body

    if (!language || !code)
      return res.status(400).json({ message: 'language and code are required.' })

    if (!JUDGE0_MAP[language])
      return res.status(400).json({ message: `Unsupported language: ${language}` })

    if (code.length > MAX_CODE_LENGTH)
      return res.status(400).json({ message: 'Code too long. Max 10,000 characters.' })

    if (!process.env.JUDGE0_API_KEY)
      return res.status(503).json({ message: 'Add JUDGE0_API_KEY to server/.env' })

    // Submit code
  /*  const submitRes = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
      {
        language_id: JUDGE0_MAP[language],
        source_code: code,
        stdin: '',
      },
      {
        headers: {
          'X-RapidAPI-Key':  process.env.JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'Content-Type':    'application/json',
        },
        timeout: 15000,
      }
    )*/

    const { stdout, stderr, compile_output, time, status } = submitRes.data

    return res.json({
      stdout: stdout || '',
      stderr: compile_output || stderr || '',
      time:   time   || '0',
      status: status?.description || '',
    })

  } catch (err) {
    console.error('Code run error:', err.message)
    if (err.code === 'ECONNABORTED')
      return res.status(504).json({ message: 'Code execution timed out.' })
    if (err.response?.status === 401)
      return res.status(401).json({ message: 'Invalid Judge0 API key.' })
    return res.status(500).json({ message: 'Code execution service unavailable.' })
  }
})

router.get('/languages', (_req, res) => {
  res.json({ languages: Object.keys(JUDGE0_MAP) })
})

export default router