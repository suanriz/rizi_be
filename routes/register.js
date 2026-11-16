const express = require('express')

const createRegisterRouter = ({ registerController }) => {
  const router = express.Router()
  router.post('/', registerController.register)
  return router
}

module.exports = { createRegisterRouter }
