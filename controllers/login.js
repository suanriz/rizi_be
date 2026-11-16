const { validateLoginInput } = require('../schemas/login')

const createLoginController = ({ loginService, accountType }) => ({
  async login (req, res) {
    const input = validateLoginInput(req.body)
    const result = await loginService.login({ ...input, accountType })

    res.status(200).json({
      status: 'success',
      data: result
    })
  }
})

module.exports = { createLoginController }
