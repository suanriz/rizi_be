const test = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createLoginService } = require('../services/login')

const JWT_SECRET = 'test-secret-that-is-not-used-in-production'

const createUser = async (overrides = {}) => ({
  id: '53bc6c9f-c2a6-4820-b6f0-646b776ccc11',
  accountType: 'customer',
  email: 'customer@example.com',
  name: 'Customer',
  password: await bcrypt.hash('password123', 4),
  status: true,
  ...overrides
})

test('customer login updates last login time and returns a valid JWT', async () => {
  const user = await createUser()
  let updatedLogin
  const service = createLoginService({
    userRepository: {
      findByEmail: async () => user,
      updateLastLoginAt: async (id, date) => {
        updatedLogin = { id, date }
      }
    },
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: '1h'
  })

  const result = await service.login({
    email: user.email,
    password: 'password123',
    accountType: 'customer'
  })

  assert.equal(updatedLogin.id, user.id)
  assert.ok(updatedLogin.date instanceof Date)
  assert.equal(result.user.accountType, 'customer')
  assert.equal(Object.hasOwn(result.user, 'password'), false)
  assert.equal(jwt.verify(result.token, JWT_SECRET).sub, user.id)
})

test('staff login accepts a staff account', async () => {
  const user = await createUser({ accountType: 'staff' })
  const service = createLoginService({
    userRepository: {
      findByEmail: async () => user,
      updateLastLoginAt: async () => undefined
    },
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: '1h'
  })

  const result = await service.login({
    email: user.email,
    password: 'password123',
    accountType: 'staff'
  })

  assert.equal(result.user.accountType, 'staff')
})

test('login rejects wrong passwords, account types, inactive and missing users', async (context) => {
  const cases = [
    { name: 'wrong password', user: await createUser(), password: 'wrong-password', accountType: 'customer' },
    { name: 'wrong account type', user: await createUser(), password: 'password123', accountType: 'staff' },
    { name: 'inactive account', user: await createUser({ status: false }), password: 'password123', accountType: 'customer' },
    { name: 'missing account', user: null, password: 'password123', accountType: 'customer' }
  ]

  for (const loginCase of cases) {
    await context.test(loginCase.name, async () => {
      const service = createLoginService({
        userRepository: {
          findByEmail: async () => loginCase.user,
          updateLastLoginAt: async () => assert.fail('invalid login must not update last login time')
        },
        jwtSecret: JWT_SECRET,
        jwtExpiresIn: '1h'
      })

      await assert.rejects(
        service.login({
          email: 'customer@example.com',
          password: loginCase.password,
          accountType: loginCase.accountType
        }),
        (err) => err.statusCode === 401 && err.message === 'Invalid email or password'
      )
    })
  }
})
