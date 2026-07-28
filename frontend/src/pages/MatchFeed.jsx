import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaHeart as Heart, FaTimes as X, FaComment as MessageCircle } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { RecommendationCard } from '../components/sections/RecommendationCard'
import { GlassCard } from '../components/common/GlassCard'
import { Button } from '../components/common/Button'
import { recommendations } from '../utils/dummyData'
import { AnimatedHeading } from '../components/animations/AnimatedHeading'
import { useNavigate } from 'react-router-dom'

export function MatchFeed() {
  const [matches, setMatches] = useState(recommendations)
  const [currentIndex, setCurrentIndex] = useState(0)
  const navigate = useNavigate()

  const currentMatch = matches[currentIndex]

  const handleLike = () => {
    setTimeout(() => {
      if (currentIndex < matches.length - 1) {
        setCurrentIndex(currentIndex + 1)
      } else {
        setMatches([])
      }
    }, 300)
  }

  const handlePass = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setMatches([])
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-2">
            🌿 The Greenhouse Whisper
          </h1>
          <p className="text-cream/60">
            Discover mentors perfectly matched to your learning goals.
          </p>
        </motion.div>

        {/* Match Cards Stack */}
        <div className="relative h-96">
          <AnimatePresence>
            {matches.length > 0 && currentMatch ? (
              <motion.div
                key={currentMatch.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <RecommendationCard
                  {...currentMatch}
                  onClick={() => navigate(`/profile/${currentMatch.mentorId}`)}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <GlassCard className="text-center p-8">
                  <p className="text-4xl mb-4">🌟</p>
                  <h2 className="text-2xl font-cinzel font-bold text-cream mb-2">
                    No More Matches Today
                  </h2>
                  <p className="text-cream/60 mb-6">
                    Check back tomorrow for more magical mentors!
                  </p>
                  <Button
                    onClick={() => navigate('/discover')}
                    variant="primary"
                  >
                    Browse All Mentors
                  </Button>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePass}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-cream transition-all"
              title="Pass"
            >
              <X size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="w-20 h-20 rounded-full bg-accent hover:bg-gold border-2 border-accent flex items-center justify-center text-dark transition-all shadow-lg"
              title="Like"
            >
              <Heart size={32} className="fill-current" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/profile/${currentMatch.mentorId}`)}
              className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 flex items-center justify-center text-cream transition-all"
              title="Message"
            >
              <MessageCircle size={24} />
            </motion.button>
          </motion.div>
        )}

        {/* Progress */}
        {matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-cream/60 text-sm">
              Match {currentIndex + 1} of {matches.length}
            </p>
            <div className="w-full bg-white/10 rounded-full h-1 mt-2 overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                animate={{
                  width: `${((currentIndex + 1) / matches.length) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}
