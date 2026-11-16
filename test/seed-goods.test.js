const test = require('node:test')
const assert = require('node:assert/strict')
const { defaultGoods, toSeedGoods, DEFAULT_STOCK, SEEDED_AT } = require('../scripts/seed-goods')

test('goods seed contains the 12 existing products in the current database shape', () => {
  assert.equal(defaultGoods.length, 12)
  assert.equal(SEEDED_AT.toISOString(), '2026-10-20T01:00:00.000Z')

  for (const goods of defaultGoods) {
    assert.equal(goods.stock, DEFAULT_STOCK)
    assert.equal(Number.isInteger(goods.sale), true)
    assert.equal(goods.sale <= goods.price, true)
    assert.equal(Number.isInteger(goods.info.acidity), true)
    assert.equal(goods.images.includes(goods.cover), true)
    assert.equal(new Set(goods.images).size, goods.images.length)
    assert.equal(goods.link, `https://suanriz.github.io/rizi/store/${goods.id}`)
    assert.equal(goods.categoryId >= 1 && goods.categoryId <= 4, true)
    assert.equal(goods.tagIds.every((tagId) => tagId === 1 || tagId === 2), true)
  }
})

test('goods seed maps frontend tag and image formats to backend values', () => {
  const [goods] = toSeedGoods([{
    id: 99,
    name: 'Test',
    price: 200,
    onSale: 180,
    type: 2,
    tag: [0, 1],
    img: 'img/storeGoods/coffeeA',
    detail: {
      imgs: ['img/storeGoods/coffeeA', 'img/storeGoods/coffeeA'],
      features: { flavor: 'A', flavorDetail: 'B', roast: 'C', acidity: '5分' },
      info: 'Info'
    }
  }])

  assert.deepEqual(goods.tagIds, [1, 2])
  assert.deepEqual(goods.images, ['/storeGoods/coffeeA.jpg'])
  assert.equal(goods.cover, '/storeGoods/coffeeA.jpg')
  assert.equal(goods.info.acidity, 5)
})
