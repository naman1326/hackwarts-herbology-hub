import React from 'react'
import { motion } from 'framer-motion'
import { FaStar as Star, FaMapPin as MapPin, FaClock as Clock } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export function MentorCard({
  id,
  name,
  avatar,
  speciality,
  rating,
  reviews,
  bio,
  availability,
  responseTime,
  students,
  onClick,
}) {
  return (
    <GlassCard hoverEffect>
      <div className="p-6 space-y-4">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <div className="text-5xl">{avatar}</div>
          <div className="flex-1">
            <h3 className="font-cinzel font-bold text-cream text-lg">{name}</h3>
            <p className="text-accent text-sm font-medium">{speciality}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star size={14} className="text-gold fill-gold" />
              <span className="text-cream text-sm font-mono">
                {rating} ({reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-cream/70 text-sm line-clamp-2">{bio}</p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-sm">
          <div>
            <p className="text-cream/60 text-xs font-mono mb-1">Response Time</p>
            <div className="flex items-center gap-1 text-cream">
              <Clock size={14} className="text-accent" />
              <span>{responseTime}</span>
            </div>
          </div>
          <div>
            <p className="text-cream/60 text-xs font-mono mb-1">Students</p>
            <p className="text-cream font-mono">{students}+</p>
          </div>
        </div>

        {/* Availability Badge */}
        <Badge variant="primary" size="sm" className="w-full justify-center">
          {availability}
        </Badge>

        {/* CTA */}
        <Button variant="primary" size="sm" className="w-full" onClick={onClick}>
          Book Session
        </Button>
      </div>
    </GlassCard>
  )
}
