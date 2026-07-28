import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPlus as Plus, FaBookOpen as BookOpen, FaGraduationCap as Grad } from 'react-icons/fa'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { DashboardCard } from '../components/sections/DashboardCard'
import { SessionCard } from '../components/sections/SessionCard'
import { GlassCard } from '../components/common/GlassCard'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { SkillCard } from '../components/sections/SkillCard'
import { AddSkillModal } from '../components/modals/AddSkillModal'
import { sessions, recommendations } from '../utils/dummyData'
import { RecommendationCard } from '../components/sections/RecommendationCard'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user, communitySkills, enrollInSkill, toastMessage } = useAuth()
  const navigate = useNavigate()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [modalDefaultType, setModalDefaultType] = useState('teach')

  const handleOpenAddModal = (type = 'teach') => {
    setModalDefaultType(type)
    setIsAddModalOpen(true)
  }

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
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 z-[9999] max-w-md p-4 rounded-xl bg-emerald-950/95 border border-amber-300/50 shadow-[0_0_20px_rgba(212,175,55,0.4)] text-cream font-medium text-sm flex items-center gap-3"
        >
          <span>{toastMessage.msg}</span>
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Greeting & Action Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-cream/60 text-sm font-mono mb-1">
                Welcome back, Young Wizard
              </p>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream">
                {user?.name}
              </h1>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="shadow-[0_0_20px_rgba(183,215,106,0.4)]"
                onClick={() => handleOpenAddModal('teach')}
              >
                ✨ + Add New Skill
              </Button>
              <div className="text-5xl hidden sm:block">{user?.avatar}</div>
            </div>
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
              description="Skills You Teach"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DashboardCard
              icon="🎓"
              label="Learning"
              value={user?.learningSkills?.length || 0}
              color="gold"
              description="Skills Enrolled"
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
            {/* Your Skills (Teaching & Learning) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-cinzel font-bold text-cream">
                  Your Skills Profile
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Teaching Skills */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <h3 className="font-cinzel font-bold text-cream">
                          Skills You Teach
                        </h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAddModal('teach')}
                      >
                        + Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {user?.teachingSkills?.length > 0 ? (
                        user.teachingSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="text-cream font-medium text-sm">{skill.name}</p>
                              {skill.sessions !== undefined && (
                                <p className="text-cream/50 text-xs">{skill.sessions} sessions taught</p>
                              )}
                            </div>
                            <Badge variant="gold" size="sm">
                              {skill.level}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-cream/50 text-sm italic">No teaching skills added yet.</p>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Learning Skills */}
                <GlassCard>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎓</span>
                        <h3 className="font-cinzel font-bold text-cream">
                          Skills You Learn
                        </h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenAddModal('learn')}
                      >
                        + Add
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {user?.learningSkills?.length > 0 ? (
                        user.learningSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div>
                              <p className="text-cream font-medium text-sm">{skill.name}</p>
                              {skill.teacher && (
                                <p className="text-gold/80 text-xs">Mentor: {skill.teacher}</p>
                              )}
                            </div>
                            <Badge variant="primary" size="sm">
                              {skill.level}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-cream/50 text-sm italic">No learning skills added yet.</p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            </motion.div>

            {/* Visible Option: Learn from Skills Taught by Others */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-cinzel font-bold text-cream">
                    🌿 Skills Offered by Community Mentors
                  </h2>
                  <p className="text-cream/60 text-xs mt-1">
                    Explore skills added by fellow wizards & click to start learning!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/discover')}
                  className="text-accent hover:text-gold transition-colors text-sm font-medium"
                >
                  Explore All →
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {communitySkills.slice(0, 4).map((skill) => {
                  const isEnrolled = user?.learningSkills?.some(
                    (s) => s.name.toLowerCase() === skill.name.toLowerCase()
                  )
                  return (
                    <SkillCard
                      key={skill.id}
                      {...skill}
                      isEnrolled={isEnrolled}
                      onEnroll={() => enrollInSkill(skill)}
                    />
                  )
                })}
              </div>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Skill Banner CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4 bg-gradient-to-br from-accent/10 via-transparent to-gold/10">
                  <div className="text-3xl">🪄</div>
                  <h3 className="font-cinzel font-bold text-cream text-lg">
                    Have a Skill to Share?
                  </h3>
                  <p className="text-cream/70 text-xs leading-relaxed">
                    Teach what you know, earn Growth Crystals, and climb the Hogwarts leaderboards!
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenAddModal('teach')}
                  >
                    ✨ Add Your Skill to Teach
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Greenhouse Whisper - Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-6">
                🌿 Recommended Mentors
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
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType={modalDefaultType}
      />
    </DashboardLayout>
  )
}

