const { EntitySchema } = require('typeorm')
const GoodsCategoryMap = new EntitySchema({
  name: 'GoodsCategoryMap',
  tableName: 'goods_category_maps',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    goodsId: {
      name: 'goods_id',
      type: 'integer'
    },
    categoryId: {
      name: 'category_id',
      type: 'integer'
    }
  },
  relations: {
    goods: {
      type: 'many-to-one',
      target: 'Goods',
      joinColumn: {
        name: 'goods_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_category_maps_goods_id_goods'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    category: {
      type: 'many-to-one',
      target: 'GoodsCategory',
      joinColumn: {
        name: 'category_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_category_maps_category_id_goods_categories'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { GoodsCategoryMap }
