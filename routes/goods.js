const express = require('express')
const { staffAuth } = require('../middlewares/staff-auth')

const createGoodsRouter = ({ goodsController, authMiddleware = staffAuth }) => {
  const router = express.Router()

  router.get('/', goodsController.getList)
  router.get('/:id', goodsController.getDetail)
  router.post('/', authMiddleware, goodsController.create)
  router.patch('/:id', authMiddleware, goodsController.update)
  router.delete('/:id', authMiddleware, goodsController.remove)

  return router
}

module.exports = { createGoodsRouter }
