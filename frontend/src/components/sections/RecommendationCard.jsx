import { motion } from 'framer-motion'
import { FaArrowRight as ArrowRight } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export function RecommendationCard({
  mentorName,
  mentorAvatar,
  skill,
  compatibility,
  reason,
  availability,
  onClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="group"
    >
      <GlassCard hoverEffect>
        <div className="p-6 space-y-4">
          {/* Header with Compatibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-4xl">{mentorAvatar}</p>
              <div>
                <h3 className="font-cinzel font-bold text-cream">{mentorName}</h3>
                <p className="text-accent text-sm">{skill}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-cream/60 text-xs font-mono">Compatibility</p>
              <p className="text-2xl font-mono font-bold text-accent">
                {compatibility}%
              </p>
            </div>
          </div>

          {/* Reason */}
          <p className="text-cream/70 text-sm italic">"{reason}"</p>

          {/* Availability */}
          <Badge variant="gold" size="sm" className="inline-block">
            {availability}
          </Badge>

          {/* CTA */}
          <Button
            variant="primary"
            size="sm"
            className="w-full flex items-center justify-center gap-2 group"
            onClick={onClick}
          >
            Connect Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  )
}
