import { motion } from 'framer-motion'
import { FaStar as Star } from 'react-icons/fa'
import { GlassCard } from '../common/GlassCard'
import { TESTIMONIALS } from '../../utils/dummyData'

export function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-cream/70 max-w-2xl mx-auto">
            Hear from real members who transformed their skills and careers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard hoverEffect>
                <div className="p-8 space-y-4 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-gold fill-gold" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-cream/80 italic flex-1">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{testimonial.image}</span>
                      <div>
                        <p className="font-cinzel font-bold text-cream">
                          {testimonial.name}
                        </p>
                        <p className="text-accent text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
