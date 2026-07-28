import { createContext, useState, useEffect } from 'react'
import { currentUser, skills as initialSkills } from '../utils/dummyData'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [communitySkills, setCommunitySkills] = useState([])
  const [toastMessage, setToastMessage] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const storedUser = localStorage.getItem('herbology_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }

      const storedSkills = localStorage.getItem('herbology_community_skills')
      if (storedSkills) {
        try {
          setCommunitySkills(JSON.parse(storedSkills))
        } catch {
          setCommunitySkills(initialSkills)
        }
      } else {
        setCommunitySkills(initialSkills)
        localStorage.setItem('herbology_community_skills', JSON.stringify(initialSkills))
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const showToast = (msg, type = 'success') => {
    setToastMessage({ msg, type, id: Date.now() })
    setTimeout(() => setToastMessage(null), 4000)
  }

  const login = async (email, password) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const mockUser = { ...currentUser, email }
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('herbology_user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('herbology_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('herbology_user', JSON.stringify(updatedUser))
  }

  const addSkill = (skillData) => {
    if (!user) return

    const { name, category, icon, level, type, description, creditsCost } = skillData
    const newId = Date.now()

    if (type === 'teach') {
      // Add to user's teaching skills
      const newTeachingSkill = {
        id: newId,
        name,
        level: level || 'Intermediate',
        sessions: 0,
        description: description || '',
      }

      const updatedTeaching = [...(user.teachingSkills || []), newTeachingSkill]
      const updatedUser = { ...user, teachingSkills: updatedTeaching }
      setUser(updatedUser)
      localStorage.setItem('herbology_user', JSON.stringify(updatedUser))

      // Add to global community skills feed for others to learn
      const newCommunitySkill = {
        id: newId,
        name,
        category: category || 'Magic',
        icon: icon || '🌿',
        difficulty: level || 'Intermediate',
        demand: 'High',
        mentorCount: 1,
        rating: 5.0,
        teacher: user.name,
        teacherAvatar: user.avatar || '🧙',
        teacherId: user.id,
        credits: parseInt(creditsCost) || 40,
        description: description || `Taught by ${user.name}`,
      }

      const updatedSkills = [newCommunitySkill, ...communitySkills]
      setCommunitySkills(updatedSkills)
      localStorage.setItem('herbology_community_skills', JSON.stringify(updatedSkills))

      showToast(`✨ Added "${name}" to your Teaching Skills & published for the community!`)
    } else {
      // Add to user's learning skills
      const newLearningSkill = {
        id: newId,
        name,
        level: level || 'Beginner',
        sessions: 0,
        description: description || '',
      }

      const updatedLearning = [...(user.learningSkills || []), newLearningSkill]
      const updatedUser = { ...user, learningSkills: updatedLearning }
      setUser(updatedUser)
      localStorage.setItem('herbology_user', JSON.stringify(updatedUser))

      showToast(`🎓 Added "${name}" to your Learning Wishlist!`)
    }
  }

  const enrollInSkill = (skill) => {
    if (!user) return

    const alreadyLearning = user.learningSkills?.some(
      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
    )
    if (alreadyLearning) {
      showToast(`You are already enrolled in "${skill.name}"!`, 'info')
      return
    }

    const newLearningSkill = {
      id: Date.now(),
      name: skill.name,
      level: skill.difficulty || 'Beginner',
      sessions: 1,
      teacher: skill.teacher || 'Community Mentor',
    }

    const updatedLearning = [...(user.learningSkills || []), newLearningSkill]
    const updatedUser = { ...user, learningSkills: updatedLearning }
    setUser(updatedUser)
    localStorage.setItem('herbology_user', JSON.stringify(updatedUser))

    showToast(`📜 Enrolled to learn "${skill.name}" from ${skill.teacher || 'Mentor'}!`)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      communitySkills,
      toastMessage,
      login,
      logout,
      updateUser,
      addSkill,
      enrollInSkill,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

