const appError = require('../utils/appError')

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validateLoginInput = (body) => {
  const source = body && typeof body === 'object' ? body : {}
  const email = typeof source.email === 'string' ? source.email.trim().toLowerCase() : ''
  const password = typeof source.password === 'string' ? source.password : ''
  const details = []

  if (!EMAIL_PATTERN.test(email) || email.length > 50) {
    details.push({ field: 'email', message: 'Email must be valid and at most 50 characters' })
  }
  if (!password || password.length > 72) {
    details.push({ field: 'password', message: 'Password is required and must be at most 72 characters' })
  }

  if (details.length > 0) {
    const error = appError(400, 'Invalid login data')
    error.details = details
    throw error
  }

  return { email, password }
}

module.exports = { validateLoginInput }
