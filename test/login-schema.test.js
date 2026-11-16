const test = require('node:test')
const assert = require('node:assert/strict')
const { validateLoginInput } = require('../schemas/login')

test('login schema normalizes email and accepts only email and password', () => {
  assert.deepEqual(validateLoginInput({
    email: ' Customer@Example.com ',
    password: 'password123',
    accountType: 'staff'
  }), {
    email: 'customer@example.com',
    password: 'password123'
  })
})

test('login schema rejects invalid credentials input', () => {
  assert.throws(
    () => validateLoginInput({ email: 'invalid', password: '' }),
    (err) => err.statusCode === 400 && err.details.length === 2
  )
})
