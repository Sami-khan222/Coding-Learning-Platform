# CodeLearn 🚀

A full-stack coding learning platform built with the MERN stack. Learn Python, JavaScript, Java, and C++ with an interactive code editor, curated video lessons, AI-powered chat, and certification quizzes.

---

## 📁 Full Folder Structure

```
codelearn/
├── package.json                    # Root - runs both client & server together
├── .gitignore
│
├── client/                         # React + Vite + Tailwind Frontend
│   ├── package.json
│   ├── vite.config.js              # Vite config + /api proxy to localhost:5000
│   ├── tailwind.config.js          # Tailwind with darkMode: 'class'
│   ├── postcss.config.js
│   ├── index.html                  # HTML entry point
│   │
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Routes (React Router v6)
│       ├── index.css               # Global styles + Tailwind directives
│       │
│       ├── pages/
│       │   ├── HomePage.jsx        # Landing page with language cards
│       │   ├── LearnPage.jsx       # Code editor + video panel
│       │   ├── QuizPage.jsx        # MCQ quiz with timer
│       │   ├── CertPage.jsx        # Certificate view + download
│       │   ├── ChatPage.jsx        # Gemini AI chat interface
│       │   ├── LoginPage.jsx       # Login form
│       │   └── RegisterPage.jsx    # Register form
│       │
│       ├── components/
│       │   ├── Navbar.jsx          # Top navigation + dark mode toggle
│       │   ├── CodeEditor.jsx      # Monaco editor + Piston code runner
│       │   ├── VideoPanel.jsx      # YouTube video cards + modal player
│       │   ├── PrivateRoute.jsx    # Auth guard component
│       │   └── LoadingSkeleton.jsx # Reusable loading placeholder
│       │
│       ├── context/
│       │   └── AuthContext.jsx     # JWT auth state (user, login, logout)
│       │
│       ├── hooks/
│       │   └── useLocalStorage.js  # Custom hook for localStorage
│       │
│       ├── utils/
│       │   └── api.js              # Axios instance with auth header
│       │
│       └── data/
│           └── videos.js           # Hardcoded curated YouTube videos
│
└── server/                         # Node.js + Express Backend
    ├── package.json
    ├── server.js                   # Express app entry point
    ├── nodemon.json                # Nodemon watch config
    ├── .env.example                # Environment variables template
    ├── seed.js                     # Database seeder (quiz questions)
    │
    ├── config/
    │   └── db.js                   # MongoDB connection (Mongoose)
    │
    ├── models/
    │   ├── User.js                 # User schema (auth + progress)
    │   ├── Question.js             # Quiz question schema
    │   ├── Certificate.js          # Certificate schema
    │   └── ChatHistory.js          # AI chat history schema
    │
    ├── routes/
    │   ├── auth.js                 # POST /api/auth/register, /login
    │   ├── code.js                 # POST /api/code/run (Piston API)
    │   ├── quiz.js                 # GET /api/quiz/:lang, POST /api/quiz/submit
    │   ├── certificate.js          # GET /api/certificate/:id
    │   ├── chat.js                 # POST /api/chat/message, /explain
    │   └── videos.js              # GET /api/videos/:lang
    │
    ├── middleware/
    │   └── verifyToken.js          # JWT auth middleware
    │
    └── data/
        └── videos.js               # Curated YouTube video data (server copy)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend | Node.js + Express.js (ES Modules) |
| Database | MongoDB Atlas (free M0 tier) |
| ODM | Mongoose |
| Auth | JWT + bcryptjs |
| Code Runner | Piston API (free, no key needed) |
| AI Chat | Google Gemini AI (`gemini-1.5-flash`, free) |
| Certificate | html2canvas |

---

## 🚀 Setup Instructions

### 1. Clone / create the project
```bash
# Install all dependencies (root + client + server)
npm run install:all
```

### 2. Set up MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create a database user
4. Whitelist your IP (or 0.0.0.0/0 for development)
5. Copy your connection string

### 3. Get Gemini API Key (free)
1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. No credit card needed — 1,500 req/day free

### 4. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env and fill in your MONGO_URI and GEMINI_API_KEY
```

### 5. Seed the database
```bash
cd server
npm run seed
```

### 6. Run the project
```bash
# From the root folder - runs both client and server together
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- API health check: http://localhost:5000/api/health

---

## 🔑 Environment Variables

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `MONGO_URI` | MongoDB connection string | MongoDB Atlas dashboard |
| `JWT_SECRET` | Random secret string | Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `GEMINI_API_KEY` | Google Gemini AI key | https://aistudio.google.com |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | Google Cloud Console (optional) |
| `PORT` | Server port | Default: 5000 |

---

## 📦 Build Steps (in order)

- [x] **Step 1** — Project setup, config files, folder structure ← You are here
- [ ] **Step 2** — Frontend shell: App.jsx, Navbar, HomePage, AuthContext, PrivateRoute
- [ ] **Step 3** — CodeEditor + VideoPanel components
- [ ] **Step 4** — Backend: server.js, MongoDB models, Auth routes, Piston code runner
- [ ] **Step 5** — Quiz system + Certificate generation
- [ ] **Step 6** — YouTube video recommendations
- [ ] **Step 7** — Gemini AI chat feature
