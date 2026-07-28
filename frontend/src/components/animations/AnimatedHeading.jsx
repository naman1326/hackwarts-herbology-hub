import { motion } from 'framer-motion'

export function AnimatedHeading({
  children,
  className = '',
  level = 'h1',
  stagger = false,
}) {
  const Tag = level
  const text = typeof children === 'string' ? children : ''
  const characters = text.split('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger ? 0.05 : 0,
      },
    },
  }

  const characterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <Tag className={className}>
      <motion.span
        className="inline-block"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {characters.map((char, i) => (
          <motion.span
            key={i}
            variants={characterVariants}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}
