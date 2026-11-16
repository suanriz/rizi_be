const test = require('node:test')
const assert = require('node:assert/strict')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { createRegisterService } = require('../services/register')

test('register creates a customer with a password hash and returns a JWT', async () => {
  let savedInput
  const repository = {
    findByEmail: async () => null,
    createCustomer: async (input) => {
      savedInput = input
      return {
        id: '53bc6c9f-c2a6-4820-b6f0-646b776ccc11',
        accountType: 'customer',
        email: input.email,
        name: input.name,
        password: input.password
      }
    }
  }
  const service = createRegisterService({
    userRepository: repository,
    jwtSecret: 'test-secret-that-is-not-used-in-production',
    jwtExpiresIn: '1h'
  })

  const result = await service.register({
    email: 'alice@example.com',
    password: 'password123',
    name: 'Alice'
  })

  assert.equal(savedInput.email, 'alice@example.com')
  assert.equal(savedInput.name, 'Alice')
  assert.notEqual(savedInput.password, 'password123')
  assert.equal(await bcrypt.compare('password123', savedInput.password), true)
  assert.equal(result.user.accountType, 'customer')
  assert.equal(Object.hasOwn(result.user, 'password'), false)
  assert.equal(jwt.verify(result.token, 'test-secret-that-is-not-used-in-production').sub, result.user.id)
})

test('register rejects an email that already exists', async () => {
  const service = createRegisterService({
    userRepository: {
      findByEmail: async () => ({ id: 'existing' }),
      createCustomer: async () => assert.fail('must not create a duplicate user')
    },
    jwtSecret: 'test-secret',
    jwtExpiresIn: '1h'
  })

  await assert.rejects(
    service.register({ email: 'alice@example.com', password: 'password123', name: 'Alice' }),
    (err) => err.statusCode === 409
  )
})
