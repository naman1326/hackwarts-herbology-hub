import React from 'react'
import { FaCalendar as Calendar, FaClock as Clock, FaMapPin as MapPin, FaUser as User } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export function SessionCard({
  id,
  mentorName,
  mentorAvatar,
  skillName,
  date,
  time,
  status,
  credits,
  description,
  meetingLink,
  onAction,
}) {
  const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    completed: 'default',
    cancelled: 'error',
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <GlassCard>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <p className="text-3xl">{mentorAvatar}</p>
            <div>
              <h3 className="font-cinzel font-bold text-cream">{mentorName}</h3>
              <p className="text-accent text-sm">{skillName}</p>
            </div>
          </div>
          <Badge variant={statusColors[status]} size="sm">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-cream/70">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-accent" />
            <span>{time}</span>
          </div>
          {description && (
            <p className="text-cream/60 pt-2">{description}</p>
          )}
        </div>

        {/* Credits */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-cream/60 text-xs font-mono mb-1">Credits</p>
          <p className="text-lg font-cinzel font-bold text-accent">
            {credits > 0 ? '+' : ''}{credits} ✨
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {meetingLink && status === 'confirmed' && (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => window.open(meetingLink)}
            >
              Join Meeting
            </Button>
          )}
          {status === 'pending' && (
            <>
              <Button variant="primary" size="sm" className="flex-1" onClick={onAction}>
                Confirm
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                Decline
              </Button>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
