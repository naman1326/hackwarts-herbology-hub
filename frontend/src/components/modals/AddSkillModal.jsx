import { useState } from 'react'
import { Modal } from '../common/Modal'
import { Input } from '../common/Input'
import { Button } from '../common/Button'
import { useAuth } from '../../hooks/useAuth'

const EMOJI_OPTIONS = ['💻', '🌿', '🎨', '🗣️', '🧪', '🍳', '🎸', '🌱', '🔮', '🪄', '📈', '🧘', '✨']
const CATEGORIES = [
  'Tech & Coding',
  'Botany & Gardening',
  'Creative & Design',
  'Languages & Communication',
  'Sciences & Potions',
  'Wellness & Culinary',
  'Music & Performance',
  'Herbology & Magic',
]
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export function AddSkillModal({ isOpen, onClose, defaultType = 'teach' }) {
  const { addSkill } = useAuth()
  const [skillType, setSkillType] = useState(defaultType) // 'teach' or 'learn'
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Tech & Coding')
  const [icon, setIcon] = useState('💻')
  const [level, setLevel] = useState('Intermediate')
  const [creditsCost, setCreditsCost] = useState('40')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    addSkill({
      type: skillType,
      name,
      category,
      icon,
      level,
      creditsCost,
      description,
    })

    // Reset & close
    setName('')
    setDescription('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ Add a Skill to Teach or Learn"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Skill Type Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-cream">
            What would you like to do?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSkillType('teach')}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                skillType === 'teach'
                  ? 'bg-accent/20 border-accent text-cream shadow-[0_0_15px_rgba(183,215,106,0.3)]'
                  : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>📚</span> I Want to Teach
              </div>
              <span className="text-xs opacity-75">
                Share your expertise & allow others to learn from you
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSkillType('learn')}
              className={`p-3 rounded-xl border transition-all text-left flex flex-col gap-1 ${
                skillType === 'learn'
                  ? 'bg-gold/20 border-gold text-cream shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border-white/10 text-cream/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>🎓</span> I Want to Learn
              </div>
              <span className="text-xs opacity-75">
                Add a skill you wish to master from other mentors
              </span>
            </button>
          </div>
        </div>

        {/* Skill Name */}
        <Input
          label="Skill Name"
          placeholder={
            skillType === 'teach'
              ? 'e.g. Full-Stack Web Development, Urban Gardening, Acoustic Guitar'
              : 'e.g. Python Programming, Spanish Practice, Herbal Tea Blending'
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Category & Level Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-white/10 text-cream focus:outline-none focus:border-accent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-emerald-950 text-cream">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-cream mb-2">
              Proficiency Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-white/10 text-cream focus:outline-none focus:border-accent"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-emerald-950 text-cream">
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-sm font-medium text-cream mb-2">
            Skill Emblem / Icon
          </label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center border transition-all ${
                  icon === emoji
                    ? 'bg-accent/30 border-accent scale-110'
                    : 'bg-white/5 border-white/10 hover:bg-white/15'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Credits Rate (If Teaching) */}
        {skillType === 'teach' && (
          <Input
            label="Growth Crystals per Session (Credits)"
            type="number"
            placeholder="40"
            value={creditsCost}
            onChange={(e) => setCreditsCost(e.target.value)}
          />
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-cream mb-2">
            Description & Syllabus Overview
          </label>
          <textarea
            rows="3"
            placeholder={
              skillType === 'teach'
                ? 'Describe what you will teach, required materials, and what students will learn...'
                : 'Describe what topics or guidance you are seeking from a mentor...'
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-cream placeholder-cream/40 focus:outline-none focus:border-accent"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            ✨ {skillType === 'teach' ? 'Publish Teaching Skill' : 'Add to Learning Wishlist'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
