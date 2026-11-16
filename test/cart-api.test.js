const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { createApp } = require('../app')

const withServer = async (cartService, callback) => {
  const dependencies = {
    registerService: { register: async () => assert.fail('register must not be called') },
    loginService: { login: async () => assert.fail('login must not be called') },
    goodsService: {},
    cartService
  }
  const server = createApp(dependencies).listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()))
  }
}

const tokenFor = (accountType) => jwt.sign({ sub: 'customer-id', accountType }, config.secret.jwtSecret, { expiresIn: '1h' })

test('cart APIs require a customer JWT', async () => {
  const cartService = { getCart: async () => assert.fail('unauthorized request must not reach service') }
  await withServer(cartService, async (baseUrl) => {
    const missing = await fetch(`${baseUrl}/api/v1/cart`)
    const staff = await fetch(`${baseUrl}/api/v1/cart`, {
      headers: { authorization: `Bearer ${tokenFor('staff')}` }
    })
    assert.equal(missing.status, 401)
    assert.equal(staff.status, 403)
  })
})

test('customer can view, add, update and remove cart items', async () => {
  const calls = []
  const cartService = {
    getCart: async (userId) => { calls.push(['get', userId]); return { items: [] } },
    addItem: async (userId, goodsId) => { calls.push(['add', userId, goodsId]); return { goodsId, count: 1 } },
    updateItem: async (userId, goodsId, count) => { calls.push(['update', userId, goodsId, count]); return { goodsId, count } },
    removeItem: async (userId, goodsId) => { calls.push(['remove', userId, goodsId]) }
  }
  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${tokenFor('customer')}`
  }

  await withServer(cartService, async (baseUrl) => {
    const viewed = await fetch(`${baseUrl}/api/v1/cart`, { headers })
    const added = await fetch(`${baseUrl}/api/v1/cart/items`, { method: 'POST', headers, body: JSON.stringify({ goodsId: 2 }) })
    const updated = await fetch(`${baseUrl}/api/v1/cart/items/2`, { method: 'PATCH', headers, body: JSON.stringify({ count: 3 }) })
    const removed = await fetch(`${baseUrl}/api/v1/cart/items/2`, { method: 'DELETE', headers })
    assert.deepEqual([viewed.status, added.status, updated.status, removed.status], [200, 200, 200, 204])
  })

  assert.deepEqual(calls, [
    ['get', 'customer-id'],
    ['add', 'customer-id', 2],
    ['update', 'customer-id', 2, 3],
    ['remove', 'customer-id', 2]
  ])
})
