import express from 'express'
import axios   from 'axios'
import fallbackVideos, { LANGUAGE_TOPICS } from '../data/videos.js'

const router = express.Router()

const VALID_LANGS = ['python', 'javascript', 'java', 'cpp']

// Human-readable language names for YouTube search queries
const LANG_SEARCH_NAMES = {
  python:     'Python',
  javascript: 'JavaScript',
  java:       'Java',
  cpp:        'C++',
}

// ── YouTube API helper ────────────────────────────────────────────
const fetchFromYouTube = async (lang, topic) => {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null   // No key → use fallback

  const langName = LANG_SEARCH_NAMES[lang]
  const topicStr = topic && topic !== 'all' ? topic : ''
  const query    = `learn ${langName} ${topicStr} programming tutorial`.trim()

  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part:             'snippet',
      q:                query,
      type:             'video',
      maxResults:       6,
      relevanceLanguage:'en',
      videoDuration:    'medium',   // filter out very short clips
      key:              apiKey,
    },
    timeout: 8000,
  })

  // Map YouTube API response → our video shape
  return response.data.items
    .filter(item => item.id?.videoId)   // ensure videoId exists
    .map(item => ({
      youtubeId: item.id.videoId,
      title:     item.snippet.title,
      channel:   item.snippet.channelTitle,
      topic:     topic || 'basics',
      level:     'Beginner',            // YouTube API doesn't provide difficulty
    }))
}

// ── GET /api/videos/:lang/topics ─────────────────────────────────
// Must be defined BEFORE /:lang to avoid route conflict
router.get('/:lang/topics', (req, res) => {
  const { lang } = req.params

  if (!VALID_LANGS.includes(lang))
    return res.status(400).json({ message: `Invalid language: ${lang}` })

  const topics = LANGUAGE_TOPICS[lang] || []
  res.json({ topics })
})

// ── GET /api/videos/:lang?topic=basics ───────────────────────────
router.get('/:lang', async (req, res) => {
  const { lang }  = req.params
  const { topic } = req.query   // optional filter

  if (!VALID_LANGS.includes(lang))
    return res.status(400).json({ message: `Invalid language: ${lang}` })

  // Try YouTube API first
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const ytVideos = await fetchFromYouTube(lang, topic)

      if (ytVideos && ytVideos.length > 0) {
        return res.json({
          videos: ytVideos,
          total:  ytVideos.length,
          source: 'youtube',
        })
      }
    } catch (err) {
      // Log but don't crash — fall through to hardcoded data
      console.warn(`YouTube API failed (${err.response?.status || err.code}), using fallback data`)
    }
  }

  // Fallback: hardcoded curated videos
  const langVideos = fallbackVideos[lang] || []
  const filtered   = topic && topic !== 'all'
    ? langVideos.filter(v => v.topic === topic)
    : langVideos

  res.json({
    videos: filtered,
    total:  filtered.length,
    source: 'fallback',
  })
})

export default router
