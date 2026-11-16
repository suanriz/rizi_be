const test = require('node:test')
const assert = require('node:assert/strict')
const { CartItem } = require('../entities/cart-item')

test('cart item entity matches the approved cart_items schema', () => {
  const columns = CartItem.options.columns
  assert.equal(CartItem.options.tableName, 'cart_items')
  assert.equal(columns.userId.name, 'user_id')
  assert.equal(columns.goodsId.name, 'goods_id')
  assert.equal(columns.count.type, 'integer')
  assert.equal(CartItem.options.indices.some((index) => index.name === 'uq_cart_items_user_goods' && index.unique), true)
})
