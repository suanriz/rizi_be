const jwt = require('jsonwebtoken')
const config = require('../config')
const appError = require('../utils/appError')

const customerAuth = (req, _res, next) => {
  const [scheme, token] = req.get('authorization')?.split(' ') || []
  if (scheme !== 'Bearer' || !token) throw appError(401, 'Authentication required')

  try {
    const payload = jwt.verify(token, config.secret.jwtSecret)
    if (typeof payload !== 'object' || payload.accountType !== 'customer' || !payload.sub) {
      throw appError(403, 'Customer access required')
    }
    req.auth = { userId: payload.sub, accountType: payload.accountType }
    next()
  } catch (err) {
    if (err.statusCode) throw err
    throw appError(401, 'Invalid or expired token')
  }
}

module.exports = { customerAuth }
