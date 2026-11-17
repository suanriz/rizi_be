const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const config = require('../config')
const { createApp } = require('../app')

const validGoodsBody = {
  title: 'Test goods',
  link: '/store/1',
  price: 300,
  onSale: 250,
  category: 1,
  tag: [1, 2],
  cover: '/storeGoods/cover.jpg',
  otherImgs: ['/storeGoods/1.jpg', '/storeGoods/2.jpg', '/storeGoods/3.jpg', '/storeGoods/4.jpg'],
  status: 1,
  flavor: 'Berry',
  flavorDetail: 'Berry flavor',
  roast: 'Light',
  acidity: 5,
  info: 'Product info'
}

const withServer = async (goodsService, callback) => {
  const registerService = { register: async () => assert.fail('register must not be called') }
  const loginService = { login: async () => assert.fail('login must not be called') }
  const server = createApp({ registerService, loginService, goodsService }).listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address()
  try {
    await callback(`http://127.0.0.1:${port}`)
  } finally {
    await new Promise((resolve, reject) => server.close((err) => err ? reject(err) : resolve()))
  }
}

const tokenFor = (accountType) => jwt.sign({ sub: 'user-id', accountType }, config.secret.jwtSecret, { expiresIn: '1h' })

test('public goods list and detail do not require authentication', async () => {
  const goodsService = {
    getList: async (query) => ({ query, list: [], total: 0 }),
    getDetail: async (id) => ({ id, name: 'Coffee' })
  }
  await withServer(goodsService, async (baseUrl) => {
    const listResponse = await fetch(`${baseUrl}/api/v1/goods?page=2&pageSize=6&type=1&keyword=Coffee`)
    const detailResponse = await fetch(`${baseUrl}/api/v1/goods/3`)
    const listBody = await listResponse.json()

    assert.equal(listResponse.status, 200)
    assert.deepEqual(listBody.data.query, { page: 2, pageSize: 6, type: 1, keyword: 'Coffee' })
    assert.equal(detailResponse.status, 200)
  })
})

test('goods writes reject missing and customer tokens', async () => {
  const goodsService = { create: async () => assert.fail('unauthorized request must not reach service') }
  await withServer(goodsService, async (baseUrl) => {
    const missingToken = await fetch(`${baseUrl}/api/v1/goods`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validGoodsBody)
    })
    const customerToken = await fetch(`${baseUrl}/api/v1/goods`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${tokenFor('customer')}` },
      body: JSON.stringify(validGoodsBody)
    })

    assert.equal(missingToken.status, 401)
    assert.equal(customerToken.status, 403)
  })
})

test('staff token can create, update and request deletion', async () => {
  const calls = []
  const goodsService = {
    create: async (_input, userId) => { calls.push(['create', userId]); return { id: 1 } },
    update: async (id, _input, userId) => { calls.push(['update', id, userId]); return { id } },
    remove: async (id) => {
      calls.push(['remove', id])
      const error = new Error('Goods cannot be deleted; set status to disabled instead')
      error.statusCode = 409
      throw error
    }
  }
  const headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${tokenFor('staff')}`
  }

  await withServer(goodsService, async (baseUrl) => {
    const created = await fetch(`${baseUrl}/api/v1/goods`, { method: 'POST', headers, body: JSON.stringify(validGoodsBody) })
    const updated = await fetch(`${baseUrl}/api/v1/goods/1`, { method: 'PATCH', headers, body: JSON.stringify(validGoodsBody) })
    const deleted = await fetch(`${baseUrl}/api/v1/goods/1`, { method: 'DELETE', headers })

    assert.equal(created.status, 201)
    assert.equal(updated.status, 200)
    assert.equal(deleted.status, 409)
  })

  assert.deepEqual(calls, [['create', 'user-id'], ['update', 1, 'user-id'], ['remove', 1]])
})
