const { validateRegisterInput } = require('../schemas/register')

const createRegisterController = ({ registerService }) => ({
  async register (req, res) {
    const input = validateRegisterInput(req.body)
    const result = await registerService.register(input)

    res.status(201).json({
      status: 'success',
      data: result
    })
  }
})

module.exports = { createRegisterController }
