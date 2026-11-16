const { EntitySchema } = require('typeorm')

const GoodsTag = new EntitySchema({
  name: 'GoodsTag',
  tableName: 'goods_tags',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    label: {
      type: 'varchar',
      length: 10
    }
  }
})

module.exports = { GoodsTag }
