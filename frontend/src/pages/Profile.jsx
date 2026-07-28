import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar as Star, FaEdit as Edit, FaShareAlt as Share2, FaComment as MessageCircle } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import { GlassCard } from '../components/common/GlassCard'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { ACHIEVEMENTS } from '../utils/dummyData'

export function Profile() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  })

  const handleSave = () => {
    updateUser(formData)
    setIsEditing(false)
  }

  const userAchievements = ACHIEVEMENTS.filter(a =>
    user?.achievements?.includes(a.id)
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-8xl">{user?.avatar}</div>
                  <div className="space-y-2">
                    <h1 className="text-4xl font-cinzel font-bold text-cream">
                      {user?.name}
                    </h1>
                    <Badge variant="primary">{user?.level}</Badge>
                    <div className="flex items-center gap-2 mt-2">
                      <Star size={16} className="text-gold fill-gold" />
                      <span className="text-cream font-mono">
                        {user?.rating} ({user?.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={Share2}>
                    Share
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancel' : <Edit size={16} />}
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <div className="border-t border-white/10 pt-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bio: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-cream focus:outline-none focus:border-accent"
                      rows="3"
                    />
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <p className="text-cream/70">{user?.bio}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-cream/60 text-sm">Joined</p>
                  <p className="font-cinzel font-bold text-cream">
                    {new Date(user?.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-cream/60 text-sm">Teaching</p>
                  <p className="font-cinzel font-bold text-accent">
                    {user?.teachingSkills?.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-cream/60 text-sm">Learning</p>
                  <p className="font-cinzel font-bold text-accent">
                    {user?.learningSkills?.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-cream/60 text-sm">Sessions</p>
                  <p className="font-cinzel font-bold text-accent">
                    {user?.completedSessions}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Teaching Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-4">
                Teaching Skills
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {user?.teachingSkills?.map((skill) => (
                  <GlassCard key={skill.id} hoverEffect>
                    <div className="p-6 space-y-3">
                      <h3 className="font-cinzel font-bold text-cream">
                        {skill.name}
                      </h3>
                      <Badge variant="gold">{skill.level}</Badge>
                      <p className="text-cream/70 text-sm">
                        {skill.sessions} sessions taught
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>

            {/* Learning Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-4">
                Learning Skills
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {user?.learningSkills?.map((skill) => (
                  <GlassCard key={skill.id} hoverEffect>
                    <div className="p-6 space-y-3">
                      <h3 className="font-cinzel font-bold text-cream">
                        {skill.name}
                      </h3>
                      <Badge variant="primary">{skill.level}</Badge>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="h-full bg-accent rounded-full"
                          animate={{
                            width: `${skill.sessions * 10}%`,
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <p className="text-cream/70 text-sm">
                        {skill.sessions} sessions attended
                      </p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement) => {
                  const isUnlocked = userAchievements.some(
                    (a) => a.id === achievement.id
                  )
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      className={`p-4 rounded-lg text-center ${
                        isUnlocked
                          ? 'bg-gold/20 border border-gold/50'
                          : 'bg-white/5 border border-white/10 opacity-50'
                      }`}
                    >
                      <p className="text-3xl mb-2">{achievement.icon}</p>
                      <p className="font-poppins text-xs font-bold text-cream">
                        {achievement.name}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  <h3 className="font-cinzel font-bold text-cream">Credits</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-cinzel font-bold text-accent">
                      {user?.credits}
                    </p>
                    <p className="text-cream/60 text-sm">✨ Available</p>
                  </div>
                  <Button variant="primary" className="w-full" size="sm">
                    Buy More Credits
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
