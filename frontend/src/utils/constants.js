export const COLORS = {
  dark: '#0E1A14',
  primary: '#2F6B3B',
  accent: '#B7D76A',
  gold: '#D4AF37',
  cream: '#F5F3E7',
  card: 'rgba(255,255,255,.05)',
}

export const SKILLS = [
  { id: 1, name: 'Herbology', emoji: '🌿', category: 'Nature' },
  { id: 2, name: 'Potion Brewing', emoji: '🧪', category: 'Magic' },
  { id: 3, name: 'Spellcasting', emoji: '✨', category: 'Magic' },
  { id: 4, name: 'Wand Making', emoji: '🪄', category: 'Crafts' },
  { id: 5, name: 'Defense Magic', emoji: '🛡️', category: 'Magic' },
  { id: 6, name: 'Divination', emoji: '🔮', category: 'Magic' },
  { id: 7, name: 'Flying', emoji: '🧙‍♂️', category: 'Skills' },
  { id: 8, name: 'Transfiguration', emoji: '🔄', category: 'Magic' },
]

export const ACHIEVEMENTS = [
  { id: 1, name: 'First Bloom', description: 'Complete your first session', icon: '🌱' },
  { id: 2, name: 'Green Thumb', description: 'Earn 100 community credits', icon: '🌿' },
  { id: 3, name: 'Master Gardener', description: 'Teach 10 sessions', icon: '🌾' },
  { id: 4, name: 'Herbology Expert', description: 'Master 5 different skills', icon: '🏆' },
  { id: 5, name: 'Social Butterfly', description: 'Connect with 20 different mentors', icon: '🦋' },
]

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Luna Lovegood',
    role: 'Skill Learner',
    image: '👩‍🎓',
    text: 'The Herbology Hub has transformed how I learn. The magical interface makes every session feel special.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Cedric Diggory',
    role: 'Mentor',
    image: '👨‍🏫',
    text: 'Teaching has never been more rewarding. The credit system is fair and the community is amazing.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Cho Chang',
    role: 'Active Member',
    image: '👩‍💼',
    text: 'I love how the platform celebrates both learning and teaching. Truly a magical experience.',
    rating: 5,
  },
]

export const SESSION_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

export const CREDIT_AMOUNTS = {
  TEACHING_SESSION: 50,
  LEARNING_SESSION: 30,
  COMPLETION_BONUS: 20,
}
