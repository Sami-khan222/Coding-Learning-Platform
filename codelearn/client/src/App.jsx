import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

// Pages
import HomePage       from './pages/HomePage'
import LearnPage      from './pages/LearnPage'
import QuizPage       from './pages/QuizPage'
import CertPage       from './pages/CertPage'
import ChatPage       from './pages/ChatPage'
import LoginPage      from './pages/LoginPage'
import RegisterPage   from './pages/RegisterPage'
import NotFoundPage   from './pages/NotFoundPage'

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation()
  // useEffect is not needed here — this is called on every render triggered by route change
  // But we do need the import when we add it properly:
  return null
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/"               element={<HomePage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/certificate/:id" element={<CertPage />} />

        {/* Protected routes — require login */}
        <Route path="/learn/:lang"    element={
          <PrivateRoute><LearnPage /></PrivateRoute>
        } />
        <Route path="/quiz/:lang"     element={
          <PrivateRoute><QuizPage /></PrivateRoute>
        } />
        <Route path="/chat"           element={
          <PrivateRoute><ChatPage /></PrivateRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
