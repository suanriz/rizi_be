const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const appError = require('../utils/appError')

const BCRYPT_SALT_ROUNDS = 12

const createRegisterService = ({ userRepository, jwtSecret, jwtExpiresIn }) => ({
  async register ({ email, password, name }) {
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw appError(409, 'Email is already registered')
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
    let user

    try {
      user = await userRepository.createCustomer({ email, name, password: passwordHash })
    } catch (err) {
      if (err && err.code === '23505') {
        throw appError(409, 'Email is already registered')
      }
      throw err
    }

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
        accountType: user.accountType
      },
      token
    }
  }
})

module.exports = { createRegisterService, BCRYPT_SALT_ROUNDS }
