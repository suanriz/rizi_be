const express = require('express')

const createLoginRouter = ({ loginController }) => {
  const router = express.Router()
  router.post('/', loginController.login)
  return router
}

module.exports = { createLoginRouter }
