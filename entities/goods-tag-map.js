const { EntitySchema } = require('typeorm')
const GoodsTagMap = new EntitySchema({
  name: 'GoodsTagMap',
  tableName: 'goods_tags_maps',
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
    tagsId: {
      name: 'tags_id',
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
        foreignKeyConstraintName: 'fk_goods_tags_maps_goods_id_goods'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    tag: {
      type: 'many-to-one',
      target: 'GoodsTag',
      joinColumn: {
        name: 'tags_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_tags_maps_tags_id_goods_tags'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { GoodsTagMap }
