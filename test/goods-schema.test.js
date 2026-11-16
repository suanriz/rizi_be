const test = require('node:test')
const assert = require('node:assert/strict')
const { validateGoodsListQuery, validateGoodsInput } = require('../schemas/goods')

const validGoodsBody = {
  title: 'Test goods',
  link: '/store/1',
  price: 300,
  onSale: 250,
  category: 1,
  tag: [1, 2, 2],
  cover: '/storeGoods/cover.jpg',
  otherImgs: ['/storeGoods/1.jpg', '/storeGoods/2.jpg', '/storeGoods/3.jpg', '/storeGoods/4.jpg'],
  status: 1,
  flavor: 'Berry',
  flavorDetail: 'Berry flavor',
  roast: 'Light',
  acidity: 5,
  info: 'Product info'
}

test('goods list query applies pagination defaults and validates bounds', () => {
  assert.deepEqual(validateGoodsListQuery({}), { page: 1, pageSize: 8, type: null })
  assert.deepEqual(validateGoodsListQuery({ page: '2', pageSize: '6', type: '3' }), { page: 2, pageSize: 6, type: 3 })
  assert.throws(() => validateGoodsListQuery({ pageSize: '101' }), (err) => err.statusCode === 400)
})

test('goods input maps admin fields, removes duplicate tags and excludes stock', () => {
  const result = validateGoodsInput({ ...validGoodsBody, stock: 999 })
  assert.equal(result.name, validGoodsBody.title)
  assert.equal(result.sale, validGoodsBody.onSale)
  assert.deepEqual(result.tagIds, [1, 2])
  assert.equal(Object.hasOwn(result, 'stock'), false)
})

test('goods input rejects invalid prices, acidity and image paths', () => {
  assert.throws(
    () => validateGoodsInput({ ...validGoodsBody, onSale: 400, acidity: 6, otherImgs: [] }),
    (err) => err.statusCode === 400 && err.details.length === 3
  )
})

