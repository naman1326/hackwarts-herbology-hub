import { motion } from 'framer-motion'
import { FaArrowRight as ArrowRight } from 'react-icons/fa'
import { Button } from '../common/Button'
import { useNavigate } from 'react-router-dom'

export function CallToAction() {
  const navigate = useNavigate()

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-cinzel font-bold text-cream">
            Ready to Start Learning?
          </h2>

          <p className="text-lg text-cream/70 max-w-2xl mx-auto">
            Join thousands of learners and mentors building an amazing community.
            Your next skill is just a few clicks away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              onClick={() => navigate('/login')}
              variant="primary"
              size="lg"
              className="group"
            >
              Enter Greenhouse Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={() => navigate('/discover')}
              variant="outline"
              size="lg"
            >
              Explore Skills First
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
