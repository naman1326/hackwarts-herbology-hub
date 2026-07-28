import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaSearch as Search, FaFilter as Filter, FaPlus as Plus } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Input } from '../components/common/Input'
import { Button } from '../components/common/Button'
import { MentorCard } from '../components/sections/MentorCard'
import { SkillCard } from '../components/sections/SkillCard'
import { Badge } from '../components/common/Badge'
import { AddSkillModal } from '../components/modals/AddSkillModal'
import { mentors } from '../utils/dummyData'
import { useDebounce } from '../hooks/useDebounce'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export function Discover() {
  const { user, communitySkills, enrollInSkill, toastMessage } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMentors, setShowMentors] = useState(true)
  const [showSkills, setShowSkills] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const debouncedSearch = useDebounce(searchQuery, 300)
  const navigate = useNavigate()

  const categories = [
    'all',
    'Tech & Coding',
    'Botany & Gardening',
    'Creative & Design',
    'Languages & Communication',
    'Sciences & Potions',
    'Wellness & Culinary',
    'Music & Performance',
    'Herbology & Magic',
  ]

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor =>
      mentor.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      mentor.speciality.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  }, [debouncedSearch])

  const filteredSkills = useMemo(() => {
    const list = communitySkills.length > 0 ? communitySkills : []
    return list.filter(skill => {
      const matchesSearch =
        skill.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (skill.teacher && skill.teacher.toLowerCase().includes(debouncedSearch.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [communitySkills, debouncedSearch, selectedCategory])

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-2">
                Discover Skills & Mentors
              </h1>
              <p className="text-cream/60">
                Browse skills offered by fellow wizards, enroll to learn, or add a skill to teach!
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAddModalOpen(true)}
              className="shadow-[0_0_20px_rgba(183,215,106,0.4)] whitespace-nowrap"
            >
              ✨ + Add Skill
            </Button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Input
            placeholder="Search mentors, skills, topics, or wizards..."
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
              🎓 Skills ({filteredSkills.length})
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-cinzel font-bold text-cream">
                  Skills Offered by Community Mentors
                </h2>
                <span className="text-cream/50 text-xs font-mono">
                  {filteredSkills.length} available
                </span>
              </div>
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredSkills.map((skill) => {
                  const isEnrolled = user?.learningSkills?.some(
                    (s) => s.name.toLowerCase() === skill.name.toLowerCase()
                  )
                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <SkillCard
                        {...skill}
                        isEnrolled={isEnrolled}
                        onEnroll={() => enrollInSkill(skill)}
                      />
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      <AddSkillModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        defaultType="teach"
      />
    </DashboardLayout>
  )
}