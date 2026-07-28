import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import { useContext, useEffect } from 'react'
import { CustomCursor } from './components/animations/CustomCursor'
import { LoadingSpinner } from './components/common/LoadingSpinner'

// Pages
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Discover } from './pages/Discover'
import { MatchFeed } from './pages/MatchFeed'
import { SessionScheduler } from './pages/SessionScheduler'
import { Leaderboard } from './pages/Leaderboard'
import { Profile } from './pages/Profile'
import { NotFound } from './pages/NotFound'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <MatchFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <SessionScheduler />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  useEffect(() => {
    // Hide cursor on desktop (custom cursor is shown)
    document.body.style.cursor = 'none'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  return (
    <AuthProvider>
      <Router>
        <CustomCursor />
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App

