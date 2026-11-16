const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const config = require('./config/index')
const { dataSource } = require('./db/data-source')
const appError = require('./utils/appError')
const { createRegisterRouter } = require('./routes/register')
const { createRegisterController } = require('./controllers/register')
const { createRegisterService } = require('./services/register')
const { createLoginRouter } = require('./routes/login')
const { createLoginController } = require('./controllers/login')
const { createLoginService } = require('./services/login')
const { userRepository } = require('./repositories/user')
const { createGoodsRouter } = require('./routes/goods')
const { createGoodsController } = require('./controllers/goods')
const { createGoodsService } = require('./services/goods')
const { goodsRepository } = require('./repositories/goods')
const { createCartRouter } = require('./routes/cart')
const { createCartController } = require('./controllers/cart')
const { createCartService } = require('./services/cart')
const { cartRepository } = require('./repositories/cart')

const createApp = (dependencies = {}) => {
  const app = express()
  const registerService = dependencies.registerService || createRegisterService({
    userRepository,
    jwtSecret: config.secret.jwtSecret,
    jwtExpiresIn: config.secret.jwtExpiresIn
  })
  const registerController = createRegisterController({ registerService })
  const loginService = dependencies.loginService || createLoginService({
    userRepository,
    jwtSecret: config.secret.jwtSecret,
    jwtExpiresIn: config.secret.jwtExpiresIn
  })
  const customerLoginController = createLoginController({ loginService, accountType: 'customer' })
  const staffLoginController = createLoginController({ loginService, accountType: 'staff' })
  const goodsService = dependencies.goodsService || createGoodsService({ goodsRepository })
  const goodsController = createGoodsController({ goodsService })
  const cartService = dependencies.cartService || createCartService({ cartRepository })
  const cartController = createCartController({ cartService })
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: 'failed', message: 'Too many login attempts, please try again later' }
  })

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors())
  app.use(express.json({ limit: '10kb' }))

  app.get('/healthcheck', async (_req, res) => {
    try {
      await dataSource.query('SELECT 1')
      res.status(200).send('OK')
    } catch (_err) {
      res.status(503).send('DB Unavailable')
    }
  })

  app.use('/api/v1/register', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { status: 'failed', message: 'Too many registration attempts, please try again later' }
  }), createRegisterRouter({ registerController }))
  app.use('/api/v1/login', loginLimiter, createLoginRouter({ loginController: customerLoginController }))
  app.use('/api/v1/staff/login', loginLimiter, createLoginRouter({ loginController: staffLoginController }))
  app.use('/api/v1/goods', createGoodsRouter({ goodsController }))
  app.use('/api/v1/cart', createCartRouter({ cartController }))

  app.use((_req, _res, next) => {
    next(appError(404, 'Page not found'))
  })

  app.use((err, _req, res, _next) => {
    const statusCode = err.statusCode || 500
    const message = statusCode === 500 ? 'Internal server error' : err.message

    if (statusCode === 500) {
      console.error(err)
    }

    res.status(statusCode).json({
      status: 'failed',
      message,
      ...(err.details ? { details: err.details } : {})
    })
  })

  return app
}

const validateEnvironment = () => {
  const requiredKeys = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE', 'JWT_SECRET']
  const missingKeys = requiredKeys.filter((key) => !process.env[key])

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`)
  }
}

const startServer = async () => {
  validateEnvironment()
  await dataSource.initialize()
  const server = createApp().listen(config.web.port, () => {
    console.warn(`Server is running on port ${config.web.port}`)
  })

  const shutdown = (signal) => {
    console.warn(`${signal} received, shutting down gracefully`)
    server.close(async () => {
      if (dataSource.isInitialized) {
        await dataSource.destroy()
      }
      process.exit(0)
    })
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'))
  process.once('SIGINT', () => shutdown('SIGINT'))
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Unable to start server', err)
    process.exit(1)
  })
}

module.exports = { createApp, startServer }
