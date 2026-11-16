const test = require('node:test')
const assert = require('node:assert/strict')
const { createGoodsService } = require('../services/goods')

const rawGoods = {
  id: 1,
  name: 'Coffee',
  link: '/store/1',
  price: 300,
  sale: 250,
  type: 1,
  img: '/storeGoods/coffeeA.jpg',
  tags: [1, 2]
}

test('public goods list returns only card fields and pagination total', async () => {
  const service = createGoodsService({
    goodsRepository: { findPublicList: async () => ({ list: [rawGoods], total: 1 }) }
  })
  const result = await service.getList({ page: 1, pageSize: 8, type: null })

  assert.deepEqual(result, {
    list: [{
      id: 1,
      name: 'Coffee',
      link: '/store/1',
      img: 'img/storeGoods/coffeeA',
      price: 300,
      onSale: 250,
      type: 1,
      tag: [1, 2]
    }],
    total: 1
  })
})

test('public goods detail formats images, acidity and info for the storefront', async () => {
  const service = createGoodsService({
    goodsRepository: {
      findPublicDetailById: async () => ({
        ...rawGoods,
        images: ['/storeGoods/coffeeA.jpg', '/storeGoods/coffeeB.jpg'],
        flavor: 'Berry',
        flavor_detail: 'Berry flavor',
        roast: 'Light',
        acidity: 5,
        info: 'Line one\nLine two'
      })
    }
  })
  const result = await service.getDetail(1)

  assert.deepEqual(result.detail, {
    imgs: ['img/storeGoods/coffeeA', 'img/storeGoods/coffeeB'],
    features: { flavor: 'Berry', flavorDetail: 'Berry flavor', roast: 'Light', acidity: '5分' },
    info: ['Line one', 'Line two']
  })
})

test('goods create passes staff id and returns the new id', async () => {
  let received
  const service = createGoodsService({
    goodsRepository: {
      create: async (input, userId) => {
        received = { input, userId }
        return { goods: { id: 9 } }
      }
    }
  })
  const input = { name: 'Coffee' }

  assert.deepEqual(await service.create(input, 'staff-id'), { id: 9 })
  assert.deepEqual(received, { input, userId: 'staff-id' })
})

test('goods delete returns 409 without deleting an existing product', async () => {
  const service = createGoodsService({
    goodsRepository: { findById: async () => ({ id: 1 }) }
  })
  await assert.rejects(service.remove(1), (err) => err.statusCode === 409)
})
