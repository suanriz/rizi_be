const test = require('node:test')
const assert = require('node:assert/strict')
const { validateRegisterInput } = require('../schemas/register')

test('register schema normalizes accepted fields and ignores accountType', () => {
  const result = validateRegisterInput({
    email: ' Test@Example.com ',
    password: 'password123',
    name: ' Alice ',
    accountType: 'staff'
  })

  assert.deepEqual(result, {
    email: 'test@example.com',
    password: 'password123',
    name: 'Alice'
  })
})

test('register schema rejects invalid input', () => {
  assert.throws(
    () => validateRegisterInput({ email: 'bad', password: 'short', name: '' }),
    (err) => err.statusCode === 400 && err.details.length === 3
  )
})
