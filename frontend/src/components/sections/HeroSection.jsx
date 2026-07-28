import { motion } from 'framer-motion'
import { FaArrowRight as ArrowRight, FaStar as Star } from 'react-icons/fa'
import { Button } from '../common/Button'
import { AnimatedHeading } from '../animations/AnimatedHeading'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function HeroSection() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
            <Star size={16} className="text-accent fill-accent" />
            <span className="text-accent text-sm font-poppins font-medium">
              Join 10,000+ Learners & Mentors
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={itemVariants}>
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-cream mb-6 leading-tight">
            Enter the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-gold to-accent">
              Magical
            </span>
            {' '}Greenhouse
          </h1>
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants}>
          <p className="text-lg md:text-xl text-cream/70 max-w-2xl mx-auto mb-8 leading-relaxed">
            A community-driven skill-sharing platform where knowledge is currency.
            Teach what you know, learn what you want, grow together.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
            variant="primary"
            size="lg"
            className="group"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Enter Greenhouse'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            onClick={() => navigate('/discover')}
            variant="outline"
            size="lg"
          >
            Explore Skills
          </Button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            <div>
              <p className="text-3xl md:text-4xl font-cinzel font-bold text-accent">500+</p>
              <p className="text-cream/60 text-sm mt-1">Active Skills</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-cinzel font-bold text-accent">10K+</p>
              <p className="text-cream/60 text-sm mt-1">Community Members</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-cinzel font-bold text-accent">50K+</p>
              <p className="text-cream/60 text-sm mt-1">Sessions Completed</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
