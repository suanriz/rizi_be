const test = require('node:test')
const assert = require('node:assert/strict')
const { createApp } = require('../app')

const withServer = async (registerService, callback) => {
  const server = createApp({ registerService }).listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()

  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()))
  }
}

test('POST /api/v1/register returns 201 and forwards only validated fields', async () => {
  let receivedInput
  const registerService = {
    register: async (input) => {
      receivedInput = input
      return {
        user: { id: 'user-id', email: input.email, name: input.name, accountType: 'customer' },
        token: 'signed.jwt.token'
      }
    }
  }

  await withServer(registerService, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'Alice@Example.com',
        password: 'password123',
        name: 'Alice',
        accountType: 'staff'
      })
    })
    const body = await response.json()

    assert.equal(response.status, 201)
    assert.equal(body.status, 'success')
    assert.equal(body.data.user.accountType, 'customer')
    assert.deepEqual(receivedInput, {
      email: 'alice@example.com',
      password: 'password123',
      name: 'Alice'
    })
  })
})

test('POST /api/v1/register returns 400 for invalid input', async () => {
  const registerService = {
    register: async () => assert.fail('service must not receive invalid input')
  }

  await withServer(registerService, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'invalid', password: 'short', name: '' })
    })
    const body = await response.json()

    assert.equal(response.status, 400)
    assert.equal(body.status, 'failed')
    assert.equal(body.details.length, 3)
  })
})
