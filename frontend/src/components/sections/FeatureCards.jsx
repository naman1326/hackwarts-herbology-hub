import { motion } from 'framer-motion'
import { FaBookOpen as BookOpen, FaUsers as Users, FaTrophy as Trophy, FaBolt as Zap } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'

const features = [
  {
    icon: BookOpen,
    title: 'Learn Anything',
    description: 'Access thousands of skills taught by passionate mentors in the community.',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Connect & Grow',
    description: 'Build meaningful connections with mentors and learners worldwide.',
    color: 'gold',
  },
  {
    icon: Trophy,
    title: 'Earn Credits',
    description: 'Get rewarded for teaching. Every session earns you community credits.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Our AI algorithm matches you with the perfect mentor instantly.',
    color: 'accent',
  },
]

export function FeatureCards() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-4">
            Why Choose Us?
          </h2>
          <p className="text-lg text-cream/70 max-w-2xl mx-auto">
            Everything you need to learn and teach magical skills in one platform.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants} className="h-full flex flex-col">
                <GlassCard hoverEffect className="h-full">
                  <div className="p-8 space-y-4 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className={`text-5xl text-${feature.color}`}>
                        <Icon size={48} />
                      </div>
                      <h3 className="text-2xl font-cinzel font-bold text-cream">
                        {feature.title}
                      </h3>
                      <p className="text-cream/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
