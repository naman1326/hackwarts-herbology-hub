import { motion } from 'framer-motion'
import { FaStar as Star, FaUsers as Users } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export function SkillCard({
  id,
  name,
  category,
  icon,
  difficulty,
  demand,
  mentorCount,
  rating,
  onClick,
}) {
  const difficultyColor = {
    Beginner: 'success',
    Intermediate: 'warning',
    Advanced: 'error',
    Expert: 'gold',
  }

  return (
    <GlassCard hoverEffect onClick={onClick}>
      <div className="p-6 space-y-4">
        {/* Icon and Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl mb-2">{icon}</p>
            <h3 className="font-cinzel font-bold text-cream text-lg">{name}</h3>
            <p className="text-cream/60 text-sm">{category}</p>
          </div>
          <Badge variant="gold" size="sm">{demand}</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div>
            <p className="text-cream/60 text-xs font-mono">Difficulty</p>
            <Badge variant={difficultyColor[difficulty] || 'default'} size="sm">
              {difficulty}
            </Badge>
          </div>
          <div>
            <p className="text-cream/60 text-xs font-mono">Rating</p>
            <div className="flex items-center gap-1">
              <Star size={14} className="text-gold fill-gold" />
              <span className="text-cream font-mono text-sm">{rating}</span>
            </div>
          </div>
        </div>

        {/* Mentors */}
        <div className="flex items-center gap-2 text-cream/70 text-sm">
          <Users size={16} className="text-accent" />
          <span>{mentorCount} mentors teaching</span>
        </div>

        {/* CTA */}
        <Button variant="primary" size="sm" className="w-full">
          Learn More
        </Button>
      </div>
    </GlassCard>
  )
}
