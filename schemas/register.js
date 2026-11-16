const appError = require('../utils/appError')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateRegisterInput = (body) => {
  const source = body && typeof body === 'object' ? body : {}
  const email = typeof source.email === 'string' ? source.email.trim().toLowerCase() : ''
  const password = typeof source.password === 'string' ? source.password : ''
  const name = typeof source.name === 'string' ? source.name.trim() : ''
  const details = []

  if (!EMAIL_PATTERN.test(email) || email.length > 50) {
    details.push({ field: 'email', message: 'Email must be valid and at most 50 characters' })
  }
  if (password.length < 8 || password.length > 72) {
    details.push({ field: 'password', message: 'Password must be between 8 and 72 characters' })
  }
  if (!name || name.length > 20) {
    details.push({ field: 'name', message: 'Name is required and must be at most 20 characters' })
  }

  if (details.length > 0) {
    const error = appError(400, 'Invalid registration data')
    error.details = details
    throw error
  }

  return { email, password, name }
}

module.exports = { validateRegisterInput }
