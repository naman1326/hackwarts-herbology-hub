import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBars as Menu, FaTimes as X } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { Button } from './Button'
import { GlassCard } from './GlassCard'

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ]

  const authenticatedLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Discover', href: '/discover' },
    { label: 'Matches', href: '/matches' },
    { label: 'Schedule', href: '/schedule' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-40 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-cinzel font-bold text-xl"
          >
            <span className="text-3xl">🌿</span>
            <span className="text-cream">Herbology</span>
            <span className="text-accent">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {(isAuthenticated ? authenticatedLinks : navLinks).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg font-poppins text-sm font-medium transition-all duration-150 ${
                  isActive(link.href)
                    ? 'bg-accent/15 text-accent font-semibold border border-accent/30 shadow-sm'
                    : 'text-cream/70 hover:text-cream hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{user?.avatar}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-poppins font-medium text-cream">
                      {user?.name}
                    </span>
                    <span className="text-xs text-accent font-mono">
                      ✨ {user?.credits}
                    </span>
                  </div>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  size="sm"
                >
                  Enter Greenhouse
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cream hover:text-accent transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 space-y-2"
          >
            {(isAuthenticated ? authenticatedLinks : navLinks).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg font-poppins transition-colors ${
                  isActive(link.href)
                    ? 'bg-accent/10 text-accent'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    variant="primary"
                    size="sm"
                    className="flex-1"
                  >
                    Enter
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
