const { EntitySchema } = require('typeorm')

const GoodsCategory = new EntitySchema({
  name: 'GoodsCategory',
  tableName: 'goods_categories',
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

module.exports = { GoodsCategory }
