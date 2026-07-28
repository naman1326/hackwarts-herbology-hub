import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '../components/layout/MainLayout'
import { Button } from '../components/common/Button'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Number */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <p className="text-9xl font-cinzel font-bold bg-gradient-to-r from-accent to-gold text-transparent bg-clip-text">
              404
            </p>
          </motion.div>

          {/* Message */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream">
              Lost in the Greenhouse?
            </h1>
            <p className="text-lg text-cream/70 max-w-md mx-auto">
              The spell you cast doesn't exist. Let's get you back to the magical
              gardens.
            </p>
          </div>

          {/* Floating Plants */}
          <motion.div
            className="flex justify-center gap-4 py-8"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-6xl">🌿</span>
            <span className="text-6xl">🌱</span>
            <span className="text-6xl">🍃</span>
          </motion.div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              onClick={() => navigate('/')}
              variant="primary"
              size="lg"
            >
              Back Home
            </Button>
            <Button
              onClick={() => navigate('/discover')}
              variant="outline"
              size="lg"
            >
              Explore Skills
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  )
}
