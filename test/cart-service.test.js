const test = require('node:test')
const assert = require('node:assert/strict')
const { createCartService } = require('../services/cart')

test('cart list maps database products to frontend cart items', async () => {
  const service = createCartService({
    cartRepository: {
      findByUserId: async () => [{
        goods_id: 2,
        count: 3,
        name: 'Coffee',
        link: '/store/2',
        img: '/storeGoods/coffeeA.jpg',
        price: 300,
        sale: 250,
        type: 1,
        tags: [1]
      }]
    }
  })
  const result = await service.getCart('user-id')

  assert.deepEqual(result.items[0], {
    id: 2,
    count: 3,
    checked: true,
    name: 'Coffee',
    link: '/store/2',
    img: 'img/storeGoods/coffeeA',
    price: 300,
    onSale: 250,
    type: 1,
    tag: [1]
  })
})

test('adding a duplicate cart item returns its incremented count', async () => {
  const service = createCartService({
    cartRepository: { add: async () => ({ goods_id: 2, count: 4 }) }
  })
  assert.deepEqual(await service.addItem('user-id', 2), { goodsId: 2, count: 4 })
})

test('cart update and removal reject missing items', async () => {
  const service = createCartService({
    cartRepository: {
      updateCount: async () => null,
      remove: async () => false
    }
  })
  await assert.rejects(service.updateItem('user-id', 2, 3), (err) => err.statusCode === 404)
  await assert.rejects(service.removeItem('user-id', 2), (err) => err.statusCode === 404)
})
