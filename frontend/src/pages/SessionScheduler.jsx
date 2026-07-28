import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCalendar as Calendar, FaClock as Clock, FaUser as User, FaMapPin as MapPin } from 'react-icons/fa'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { GlassCard } from '../components/common/GlassCard'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Badge } from '../components/common/Badge'
import { Modal } from '../components/common/Modal'
import { SessionCard } from '../components/sections/SessionCard'
import { mentors, sessions } from '../utils/dummyData'

export function SessionScheduler() {
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [bookedSessions, setBookedSessions] = useState(sessions)

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ]

  const handleBookSession = () => {
    if (selectedMentor && selectedDate && selectedTime) {
      const newSession = {
        id: `session-${Date.now()}`,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorAvatar: selectedMentor.avatar,
        skillName: selectedMentor.speciality,
        date: new Date(selectedDate),
        time: `${selectedTime} - ${selectedTime}`,
        status: 'pending',
        credits: 30,
        duration: 60,
      }
      setBookedSessions([newSession, ...bookedSessions])
      setBookingModalOpen(false)
      setSelectedMentor(null)
      setSelectedDate('')
      setSelectedTime('')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-cream mb-2">
            Schedule a Session
          </h1>
          <p className="text-cream/60">
            Book time with your favorite mentors and start learning.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mentor Selection */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-cinzel font-bold text-cream mb-4">
                Select Mentor
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mentors.map((mentor) => (
                  <motion.button
                    key={mentor.id}
                    onClick={() => {
                      setSelectedMentor(mentor)
                      setBookingModalOpen(true)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedMentor?.id === mentor.id
                        ? 'bg-accent/20 border-2 border-accent'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{mentor.avatar}</span>
                      <div>
                        <p className="font-cinzel font-bold text-cream">
                          {mentor.name}
                        </p>
                        <p className="text-accent text-sm">{mentor.speciality}</p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Calendar and Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-cinzel font-bold text-cream mb-4">
                Your Scheduled Sessions
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {bookedSessions.map((session) => (
                  <SessionCard key={session.id} {...session} />
                ))}
              </div>
            </motion.div>

            {/* Booking Form */}
            {selectedMentor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard>
                  <div className="p-6 space-y-6">
                    <h3 className="text-xl font-cinzel font-bold text-cream">
                      Book with {selectedMentor.name}
                    </h3>

                    {/* Selected Info */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2 text-cream/70">
                        <User size={16} className="text-accent" />
                        <span>{selectedMentor.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cream/70">
                        <BookOpen size={16} className="text-accent" />
                        <span>{selectedMentor.speciality}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cream/70">
                        <Clock size={16} className="text-accent" />
                        <span>Duration: 60 minutes</span>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <Input
                      label="Select Date"
                      type="date"
                      icon={Calendar}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />

                    {/* Time Selection */}
                    <div>
                      <label className="block text-sm font-medium text-cream mb-3">
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <motion.button
                            key={slot}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2 rounded-lg transition-all text-sm font-mono ${
                              selectedTime === slot
                                ? 'bg-accent text-dark'
                                : 'bg-white/5 text-cream hover:bg-white/10'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-cream/70">Cost</span>
                        <span className="text-2xl font-cinzel font-bold text-accent">
                          30 ✨
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={handleBookSession}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      disabled={!selectedDate || !selectedTime}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
