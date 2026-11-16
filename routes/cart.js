const express = require('express')
const { customerAuth } = require('../middlewares/customer-auth')

const createCartRouter = ({ cartController, authMiddleware = customerAuth }) => {
  const router = express.Router()
  router.use(authMiddleware)
  router.get('/', cartController.getCart)
  router.post('/items', cartController.addItem)
  router.patch('/items/:goodsId', cartController.updateItem)
  router.delete('/items/:goodsId', cartController.removeItem)
  return router
}

module.exports = { createCartRouter }
