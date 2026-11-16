const test = require('node:test')
const assert = require('node:assert/strict')
const { createApp } = require('../app')

const withServer = async (loginService, callback) => {
  const registerService = { register: async () => assert.fail('register must not be called') }
  const server = createApp({ registerService, loginService }).listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()

  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()))
  }
}

test('customer and staff login routes enforce their account types', async () => {
  const receivedInputs = []
  const loginService = {
    login: async (input) => {
      receivedInputs.push(input)
      return {
        user: { id: 'user-id', email: input.email, name: 'User', accountType: input.accountType },
        token: 'signed.jwt.token'
      }
    }
  }

  await withServer(loginService, async (baseUrl) => {
    for (const path of ['/api/v1/login', '/api/v1/staff/login']) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'User@Example.com',
          password: 'password123',
          accountType: 'injected-value'
        })
      })

      assert.equal(response.status, 200)
    }
  })

  assert.deepEqual(receivedInputs, [
    { email: 'user@example.com', password: 'password123', accountType: 'customer' },
    { email: 'user@example.com', password: 'password123', accountType: 'staff' }
  ])
})

test('login routes return 400 before calling the service for invalid input', async () => {
  const loginService = { login: async () => assert.fail('service must not receive invalid input') }

  await withServer(loginService, async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/v1/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'invalid', password: '' })
    })

    assert.equal(response.status, 400)
  })
})
