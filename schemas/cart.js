const appError = require('../utils/appError')

const validateGoodsId = (value) => {
  const goodsId = Number(value)
  if (!Number.isInteger(goodsId) || goodsId <= 0) throw appError(400, 'Goods id must be a positive integer')
  return goodsId
}

const validateAddCartItem = (body) => validateGoodsId(body?.goodsId)

const validateCartCount = (body) => {
  const count = Number(body?.count)
  if (!Number.isInteger(count) || count < 1 || count > 999) {
    throw appError(400, 'Cart item count must be an integer between 1 and 999')
  }
  return count
}

module.exports = { validateGoodsId, validateAddCartItem, validateCartCount }
