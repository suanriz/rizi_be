const { EntitySchema } = require('typeorm')
const GoodsImgMap = new EntitySchema({
  name: 'GoodsImgMap',
  tableName: 'goods_imgs_maps',
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
    goodsImgsId: {
      name: 'goods_imgs_id',
      type: 'integer'
    },
    cover: {
      type: 'boolean',
      default: false
    }
  },
  relations: {
    goods: {
      type: 'many-to-one',
      target: 'Goods',
      joinColumn: {
        name: 'goods_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_imgs_maps_goods_id_goods'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    goodsImg: {
      type: 'many-to-one',
      target: 'GoodsImg',
      joinColumn: {
        name: 'goods_imgs_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_imgs_maps_goods_imgs_id_goods_imgs'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { GoodsImgMap }
