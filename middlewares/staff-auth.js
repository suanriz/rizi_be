const jwt = require('jsonwebtoken')
const config = require('../config')
const appError = require('../utils/appError')

const staffAuth = (req, _res, next) => {
  const authorization = req.get('authorization')
  const [scheme, token] = authorization?.split(' ') || []

  if (scheme !== 'Bearer' || !token) {
    throw appError(401, 'Authentication required')
  }

  try {
    const payload = jwt.verify(token, config.secret.jwtSecret)
    if (typeof payload !== 'object' || payload.accountType !== 'staff' || !payload.sub) {
      throw appError(403, 'Staff access required')
    }
    req.auth = { userId: payload.sub, accountType: payload.accountType }
    next()
  } catch (err) {
    if (err.statusCode) {
      throw err
    }
    throw appError(401, 'Invalid or expired token')
  }
}

module.exports = { staffAuth }
