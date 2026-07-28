import { motion } from 'framer-motion'
import { FaStar as Star, FaUsers as Users, FaGraduationCap as Grad } from 'react-icons/fa'
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
  mentorCount = 1,
  rating = 4.8,
  teacher,
  teacherAvatar,
  credits = 40,
  description,
  onEnroll,
  isEnrolled,
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
      <div className="p-6 space-y-4 flex flex-col justify-between h-full">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl p-2 rounded-xl bg-white/5 border border-white/10">
                {icon || '🌿'}
              </span>
              <div>
                <h3 className="font-cinzel font-bold text-cream text-lg line-clamp-1">{name}</h3>
                <p className="text-accent text-xs font-mono">{category}</p>
              </div>
            </div>
            {credits && (
              <Badge variant="gold" size="sm" className="whitespace-nowrap">
                ✨ {credits} Credits
              </Badge>
            )}
          </div>

          {/* Teacher Info (Visible skills added by others) */}
          {teacher && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-cream/80">
              <span className="text-base">{teacherAvatar || '🧙‍♂️'}</span>
              <span>
                Offered by <strong className="text-gold">{teacher}</strong>
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p className="text-cream/70 text-xs line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs">
            <div>
              <p className="text-cream/50 font-mono">Level</p>
              <Badge variant={difficultyColor[difficulty] || 'primary'} size="sm">
                {difficulty || 'Intermediate'}
              </Badge>
            </div>
            <div>
              <p className="text-cream/50 font-mono">Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={13} className="text-gold fill-gold" />
                <span className="text-cream font-mono font-bold">{rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-3 border-t border-white/10">
          <Button
            variant={isEnrolled ? 'secondary' : 'primary'}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              if (onEnroll) onEnroll()
            }}
            disabled={isEnrolled}
          >
            {isEnrolled ? '✓ Already Learning' : '🎓 Learn This Skill'}
          </Button>
        </div>
      </div>
    </GlassCard>
  )
}

