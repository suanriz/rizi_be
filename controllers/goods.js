const { validateId, validateGoodsListQuery, validateGoodsInput } = require('../schemas/goods')

const createGoodsController = ({ goodsService }) => ({
  async getList (req, res) {
    const query = validateGoodsListQuery(req.query)
    const data = await goodsService.getList(query)
    res.status(200).json({ status: 'success', data })
  },

  async getDetail (req, res) {
    const data = await goodsService.getDetail(validateId(req.params.id))
    res.status(200).json({ status: 'success', data })
  },

  async create (req, res) {
    const data = await goodsService.create(validateGoodsInput(req.body), req.auth.userId)
    res.status(201).json({ status: 'success', code: '1', data })
  },

  async update (req, res) {
    const id = validateId(req.params.id)
    const data = await goodsService.update(id, validateGoodsInput(req.body), req.auth.userId)
    res.status(200).json({ status: 'success', code: '1', data })
  },

  async remove (req, res) {
    await goodsService.remove(validateId(req.params.id))
    res.status(204).send()
  }
})

module.exports = { createGoodsController }
