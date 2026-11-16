const { dataSource } = require('../db/data-source')

const getRepository = () => dataSource.getRepository('User')

const userRepository = {
  findByEmail (email) {
    return getRepository().findOne({ where: { email } })
  },

  async updateLastLoginAt (id, lastLoginAt) {
    await getRepository().update({ id }, { lastLoginAt })
  },

  createCustomer ({ email, name, password }) {
    const repository = getRepository()
    const user = repository.create({
      accountType: 'customer',
      email,
      name,
      password,
      status: true,
      roleId: null
    })
    return repository.save(user)
  }
}

module.exports = { userRepository }
