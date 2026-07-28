import React from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../common/GlassCard'

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up and tell us about yourself, your skills, and what you want to learn.',
    icon: '👤',
  },
  {
    number: '02',
    title: 'Find Your Match',
    description: 'Browse mentors or let our AI recommend perfect matches for your learning goals.',
    icon: '🎯',
  },
  {
    number: '03',
    title: 'Schedule & Learn',
    description: 'Book a session, meet your mentor, and start learning at your own pace.',
    icon: '📅',
  },
  {
    number: '04',
    title: 'Teach & Earn',
    description: 'Share your knowledge with others and earn credits to spend on learning.',
    icon: '✨',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-4">
            How It Works
          </h2>
          <p className="text-lg text-cream/70 max-w-2xl mx-auto">
            Four simple steps to start your magical learning journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="p-6 space-y-4">
                  {/* Number Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-5xl font-cinzel font-bold text-accent/30">
                      {step.number}
                    </span>
                    <span className="text-4xl">{step.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-cinzel font-bold text-cream">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-cream/70 text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-12">
                      <span className="text-3xl text-accent/30">→</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
