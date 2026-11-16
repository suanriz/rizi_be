const test = require('node:test')
const assert = require('node:assert/strict')
const { validateGoodsId, validateAddCartItem, validateCartCount } = require('../schemas/cart')

test('cart schema accepts valid goods ids and counts', () => {
  assert.equal(validateGoodsId('3'), 3)
  assert.equal(validateAddCartItem({ goodsId: 5 }), 5)
  assert.equal(validateCartCount({ count: 999 }), 999)
})

test('cart schema rejects invalid goods ids and counts', () => {
  assert.throws(() => validateGoodsId('0'), (err) => err.statusCode === 400)
  assert.throws(() => validateCartCount({ count: 1000 }), (err) => err.statusCode === 400)
})
