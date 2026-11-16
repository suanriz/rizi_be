const { validateGoodsId, validateAddCartItem, validateCartCount } = require('../schemas/cart')

const createCartController = ({ cartService }) => ({
  async getCart (req, res) {
    const data = await cartService.getCart(req.auth.userId)
    res.status(200).json({ status: 'success', data })
  },

  async addItem (req, res) {
    const data = await cartService.addItem(req.auth.userId, validateAddCartItem(req.body))
    res.status(200).json({ status: 'success', data })
  },

  async updateItem (req, res) {
    const goodsId = validateGoodsId(req.params.goodsId)
    const data = await cartService.updateItem(req.auth.userId, goodsId, validateCartCount(req.body))
    res.status(200).json({ status: 'success', data })
  },

  async removeItem (req, res) {
    await cartService.removeItem(req.auth.userId, validateGoodsId(req.params.goodsId))
    res.status(204).send()
  }
})

module.exports = { createCartController }
