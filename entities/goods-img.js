const { EntitySchema } = require('typeorm')

const GoodsImg = new EntitySchema({
  name: 'GoodsImg',
  tableName: 'goods_imgs',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    path: {
      type: 'varchar',
      length: 255
    }
  }
})

module.exports = { GoodsImg }
