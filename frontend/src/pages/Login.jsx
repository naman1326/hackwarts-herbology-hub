import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaEnvelope as Mail, FaLock as Lock, FaEye as Eye, FaEyeSlash as EyeOff } from 'react-icons/fa'
import { AuthLayout } from '../components/layout/AuthLayout'
import { GlassCard } from '../components/common/GlassCard'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard>
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-cinzel font-bold text-cream">
                Enter the Greenhouse
              </h1>
              <p className="text-cream/60">
                Welcome back, young wizard. Cast your spell to continue.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Owl Address (Email)"
                type="email"
                icon={Mail}
                placeholder="your.email@hogwarts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div>
                <Input
                  label="Secret Spell (Password)"
                  type={showPassword ? 'text' : 'password'}
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mt-2 text-accent text-sm hover:text-gold transition-colors flex items-center gap-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showPassword ? 'Hide' : 'Show'} Spell
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isLoading}
              >
                {isLoading ? 'Casting Spell...' : 'Cast Spell'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark text-cream/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" size="md">
                🧙 Discord
              </Button>
              <Button variant="outline" size="md">
                📧 Google
              </Button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-cream/60">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-accent hover:text-gold transition-colors font-medium"
              >
                Join Now
              </button>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </AuthLayout>
  )
}
