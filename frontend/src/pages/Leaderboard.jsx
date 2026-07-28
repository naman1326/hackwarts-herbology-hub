import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTrophy as Trophy, FaMedal as Medal, FaChartLine as TrendingUp } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { GlassCard } from '../components/common/GlassCard'
import { Badge } from '../components/common/Badge'
import { AnimatedHeading } from '../components/animations/AnimatedHeading'
import { leaderboard } from '../utils/dummyData'
import { useAuth } from '../hooks/useAuth'

const podiumPositions = [
  { position: 2, rank: 2 },
  { position: 1, rank: 1 },
  { position: 3, rank: 3 },
]

export function Leaderboard() {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('all-time')

  const userRank = leaderboard.find(u => u.name === user?.name)?.rank

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-2">
            Hall of Green Masters
          </h1>
          <p className="text-cream/60">
            Celebrate the most active members of our community.
          </p>
        </motion.div>

        {/* Timeframe Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          {['all-time', 'this-month', 'this-week'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-poppins transition-all ${
                timeframe === tf
                  ? 'bg-accent text-dark'
                  : 'bg-white/5 text-cream hover:bg-white/10'
              }`}
            >
              {tf === 'all-time'
                ? 'All Time'
                : tf === 'this-month'
                  ? 'This Month'
                  : 'This Week'}
            </button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid md:grid-cols-3 gap-6 items-end mb-8 pt-6">
            {podiumPositions.map(({ position, rank }, idx) => {
              const entry = leaderboard[rank - 1]
              if (!entry) return null

              const isFirst = rank === 1
              const isSecond = rank === 2
              const isThird = rank === 3

              const cardStyle = isFirst
                ? 'border-2 border-amber-300/90 shadow-[0_0_35px_rgba(212,175,55,0.45)] bg-gradient-to-b from-amber-500/20 via-emerald-950/80 to-dark/95 md:-translate-y-4'
                : isSecond
                  ? 'border-2 border-slate-300/70 shadow-[0_0_20px_rgba(203,213,225,0.3)] bg-gradient-to-b from-slate-400/15 via-emerald-950/70 to-dark/90'
                  : 'border-2 border-amber-700/70 shadow-[0_0_20px_rgba(180,83,9,0.3)] bg-gradient-to-b from-amber-800/15 via-emerald-950/70 to-dark/90'

              return (
                <motion.div
                  key={rank}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="w-full flex flex-col"
                >
                  <GlassCard className={`w-full rounded-2xl ${cardStyle}`}>
                    <div className="p-6 space-y-4 flex flex-col justify-between min-h-[350px]">
                      {/* Top Medal Header */}
                      <div className="text-center relative">
                        <div className="text-5xl sm:text-6xl inline-block drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                          {isFirst ? '👑 🥇' : isSecond ? '🥈' : '🥉'}
                        </div>
                      </div>

                      {/* Rank Badge */}
                      <div className="flex justify-center">
                        <Badge
                          variant={isFirst ? 'gold' : isSecond ? 'default' : 'primary'}
                          className="px-3 py-1 text-xs font-bold font-cinzel shadow-md"
                        >
                          #{rank} Place
                        </Badge>
                      </div>

                      {/* User Info */}
                      <div className="text-center space-y-2">
                        <p className="text-4xl">{entry.avatar}</p>
                        <h3 className="font-cinzel font-bold text-cream text-lg sm:text-xl line-clamp-1">
                          {entry.name}
                        </h3>
                        <p className="text-xs font-mono text-accent">{entry.level}</p>
                      </div>

                      {/* Stats Grid */}
                      <div className="space-y-2 pt-4 border-t border-white/10 text-xs sm:text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-cream/70">Growth Crystals</span>
                          <span className="font-mono font-bold text-accent text-base">
                            ✨ {entry.credits}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-cream/70">Sessions Taught</span>
                          <span className="font-mono font-bold text-gold text-base">
                            🏆 {entry.sessions}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Your Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="bg-gradient-to-r from-accent/10 to-gold/10 border-2 border-accent/50">
              <div className="p-6">
                <p className="text-cream/70 text-sm font-mono mb-2">YOUR CURRENT RANK</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{user?.avatar}</span>
                    <div>
                      <p className="font-cinzel font-bold text-cream">
                        {user?.name}
                      </p>
                      <p className="text-accent text-sm">{user?.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-cinzel font-bold text-accent">
                      #{userRank}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Rankings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-cinzel font-bold text-cream mb-4">
            Complete Rankings
          </h2>

          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {leaderboard.map((entry, idx) => (
              <motion.div key={entry.rank} variants={itemVariants}>
                <GlassCard
                  hoverEffect
                  className={
                    entry.name === user?.name
                      ? 'bg-accent/10 border-2 border-accent'
                      : ''
                  }
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank */}
                      <div className="w-12 flex items-center justify-center">
                        {entry.rank <= 3 ? (
                          <span className="text-2xl">
                            {entry.rank === 1
                              ? '🥇'
                              : entry.rank === 2
                                ? '🥈'
                                : '🥉'}
                          </span>
                        ) : (
                          <span className="font-cinzel font-bold text-cream/70 text-lg">
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{entry.avatar}</span>
                        <div>
                          <p className="font-cinzel font-bold text-cream">
                            {entry.name}
                          </p>
                          <p className="text-accent text-sm">{entry.level}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="text-cream/60 text-xs font-mono">Credits</p>
                        <p className="font-cinzel font-bold text-accent text-lg">
                          {entry.credits}
                        </p>
                      </div>
                      <div>
                        <p className="text-cream/60 text-xs font-mono">Sessions</p>
                        <p className="font-cinzel font-bold text-gold text-lg">
                          {entry.sessions}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
