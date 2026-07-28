import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSearch as Search, FaFilter as Filter } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { MentorCard } from '../components/sections/MentorCard'
import { SkillCard } from '../components/sections/SkillCard'
import { Badge } from '../components/common/Badge'
import { AnimatedHeading } from '../components/animations/AnimatedHeading'
import { mentors, skills } from '../utils/dummyData'
import { useDebounce } from '../hooks/useDebounce'
import { useNavigate } from 'react-router-dom'

export function Discover() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMentors, setShowMentors] = useState(true)
  const [showSkills, setShowSkills] = useState(true)

  const debouncedSearch = useDebounce(searchQuery, 300)
  const navigate = useNavigate()

  const categories = [
    'all',
    'Magic',
    'Nature',
    'Crafts',
    'Combat',
  ]

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor =>
      mentor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      mentor.speciality.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch])

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [debouncedSearch, selectedCategory])

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-2">
            Discover Skills & Mentors
          </h1>
          <p className="text-cream/60">
            Find the perfect mentor or explore new skills to master.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder="Search mentors, skills, or topics..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'ghost'}
                size="sm"
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Badge>
            ))}
          </div>

          {/* View Toggles */}
          <div className="flex gap-2">
            <Button
              variant={showMentors ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowMentors(!showMentors)}
            >
              👨‍🏫 Mentors
            </Button>
            <Button
              variant={showSkills ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setShowSkills(!showSkills)}
            >
              🎓 Skills
            </Button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="space-y-8">
          {/* Mentors Section */}
          {showMentors && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-6">
                Top Mentors
              </h2>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredMentors.map((mentor) => (
                  <motion.div
                    key={mentor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <MentorCard
                      {...mentor}
                      onClick={() => navigate(`/profile/${mentor.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Skills Section */}
          {showSkills && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-cinzel font-bold text-cream mb-6">
                Popular Skills
              </h2>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredSkills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <SkillCard
                      {...skill}
                      onClick={() => navigate(`/discover?skill=${skill.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}