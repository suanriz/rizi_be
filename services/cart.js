const appError = require('../utils/appError')
const { toFrontendImage } = require('./goods')

const mapCartItem = (item) => ({
  id: item.goods_id,
  name: item.name,
  link: item.link,
  img: toFrontendImage(item.img),
  price: item.price,
  ...(item.sale < item.price ? { onSale: item.sale } : {}),
  type: item.type,
  tag: item.tags.map(Number),
  count: item.count,
  checked: true
})

const createCartService = ({ cartRepository }) => ({
  async getCart (userId) {
    const items = await cartRepository.findByUserId(userId)
    return { items: items.map(mapCartItem) }
  },

  async addItem (userId, goodsId) {
    const item = await cartRepository.add(userId, goodsId)
    if (!item) throw appError(404, 'Goods not found or unavailable')
    return { goodsId: item.goods_id, count: item.count }
  },

  async updateItem (userId, goodsId, count) {
    const item = await cartRepository.updateCount(userId, goodsId, count)
    if (!item) throw appError(404, 'Cart item not found')
    return { goodsId: item.goods_id, count: item.count }
  },

  async removeItem (userId, goodsId) {
    if (!await cartRepository.remove(userId, goodsId)) throw appError(404, 'Cart item not found')
  }
})

module.exports = { createCartService, mapCartItem }
