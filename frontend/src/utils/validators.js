export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password) {
  return password.length >= 8
}

export function validateUsername(username) {
  return username.length >= 3 && username.length <= 20
}

export function validatePhoneNumber(phone) {
  const regex = /^\d{10}$/
  return regex.test(phone.replace(/\D/g, ''))
}

export function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function validateSession(startTime, endTime) {
  return new Date(endTime) > new Date(startTime)
}

export function calculateSessionDuration(startTime, endTime) {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return (end - start) / (1000 * 60) // Duration in minutes
}
