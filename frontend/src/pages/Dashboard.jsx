import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGift as Gift, FaBookOpen as BookOpen, FaUsers as Users, FaChartLine as TrendingUp } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardCard } from '../components/sections/DashboardCard'
import { SessionCard } from '../components/sections/SessionCard'
import { GlassCard } from '../components/common/GlassCard'
import { Badge } from '../components/common/Badge'
import { AnimatedHeading } from '../components/animations/AnimatedHeading'
import { sessions, recommendations } from '../utils/dummyData'
import { RecommendationCard } from '../components/sections/RecommendationCard'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream/60 text-sm font-mono mb-2">
                Welcome back, Young Wizard
              </p>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream">
                {user?.name}
              </h1>
            </div>
            <div className="text-5xl">{user?.avatar}</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon="✨"
              label="Credits"
              value={user?.credits}
              color="accent"
              trend={12}
              description="Growth Crystals"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon="📚"
              label="Teaching"
              value={user?.teachingSkills?.length || 0}
              color="primary"
              description="Skills Available"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon="🎓"
              label="Learning"
              value={user?.learningSkills?.length || 0}
              color="gold"
              description="In Progress"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon="🏆"
              label="Sessions"
              value={user?.completedSessions || 0}
              color="accent"
              trend={8}
              description="Completed"
            />
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-cinzel font-bold text-cream">
                  Upcoming Sessions
                </h2>
                <button
                  onClick={() => navigate('/schedule')}
                  className="text-accent hover:text-gold transition-colors text-sm font-medium"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-4">
                {sessions.slice(0, 2).map((session) => (
                  <SessionCard key={session.id} {...session} />
                ))}
              </div>
            </motion.div>

            {/* Your Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-6">
                Your Skills
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Teaching Skills */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">📚</span>
                      <h3 className="font-cinzel font-bold text-cream">
                        Teaching
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {user?.teachingSkills?.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-cream">{skill.name}</span>
                          <Badge variant="gold" size="sm">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Learning Skills */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🎓</span>
                      <h3 className="font-cinzel font-bold text-cream">
                        Learning
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {user?.learningSkills?.map((skill) => (
                        <div
                          key={skill.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-cream">{skill.name}</span>
                          <Badge variant="primary" size="sm">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Greenhouse Whisper - Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-6">
                🌿 Greenhouse Whisper
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    {...rec}
                    onClick={() => navigate(`/discover?mentor=${rec.mentorId}`)}
                  />
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  <h3 className="font-cinzel font-bold text-cream">
                    Your Stats
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-cream/70">Level</span>
                      <span className="text-accent font-mono font-bold">
                        {user?.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cream/70">Rating</span>
                      <span className="text-gold font-mono font-bold">
                        ⭐ {user?.rating}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cream/70">Reviews</span>
                      <span className="text-cream font-mono font-bold">
                        {user?.reviews}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
