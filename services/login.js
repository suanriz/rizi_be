const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')

const INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password'

const createLoginService = ({ userRepository, jwtSecret, jwtExpiresIn }) => ({
  async login ({ email, password, accountType }) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const user = await userRepository.findByEmail(email)
    const isValidPassword = user ? await bcrypt.compare(password, user.password) : false

    if (!user || !isValidPassword || user.accountType !== accountType || !user.status) {
      throw appError(401, INVALID_CREDENTIALS_MESSAGE)
    }

    const lastLoginAt = new Date()
    await userRepository.updateLastLoginAt(user.id, lastLoginAt)

    const token = jwt.sign(
      { sub: user.id, accountType: user.accountType },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    )

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        accountType: user.accountType,
        lastLoginAt: lastLoginAt.toISOString()
      },
      token
    }
  }
})

module.exports = { createLoginService, INVALID_CREDENTIALS_MESSAGE }
