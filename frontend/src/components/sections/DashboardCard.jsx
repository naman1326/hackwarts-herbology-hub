import React from 'react'
import { GlassCard } from '../common/GlassCard'

export function DashboardCard({
  icon,
  label,
  value,
  description,
  color = 'accent',
  trend,
  onClick,
}) {
  const colorClasses = {
    accent: 'text-accent',
    gold: 'text-gold',
    primary: 'text-primary',
  }

  return (
    <GlassCard onClick={onClick} hoverEffect className="group">
      <div className="p-6 space-y-4">
        {/* Icon */}
        <div className={`text-4xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>

        {/* Label */}
        <p className="text-cream/70 text-sm font-mono uppercase tracking-wider">
          {label}
        </p>

        {/* Value */}
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-cinzel font-bold text-cream">{value}</p>
          {trend && (
            <span className={`text-sm font-mono ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-cream/60 text-sm">{description}</p>
        )}
      </div>
    </GlassCard>
  )
}
