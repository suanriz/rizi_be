const { EntitySchema } = require('typeorm')

const OrderStatus = new EntitySchema({
  name: 'OrderStatus',
  tableName: 'order_statuses',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    label: {
      type: 'varchar',
      length: 20
    }
  }
})

module.exports = { OrderStatus }
