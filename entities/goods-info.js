const { EntitySchema } = require('typeorm')

const GoodsInfo = new EntitySchema({
  name: 'GoodsInfo',
  tableName: 'goods_infos',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    updatedById: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true
    },
    flavor: {
      type: 'varchar',
      length: 255
    },
    flavorDetail: {
      name: 'flavor_detail',
      type: 'varchar',
      length: 255
    },
    roast: {
      type: 'varchar',
      length: 255
    },
    acidity: {
      type: 'integer'
    },
    info: {
      type: 'text'
    },
    goodsId: {
      name: 'goods_id',
      type: 'integer',
      unique: true
    }
  },
  relations: {
    updatedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'updated_by',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_infos_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    },
    goods: {
      type: 'one-to-one',
      target: 'Goods',
      joinColumn: {
        name: 'goods_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_infos_goods_id_goods'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    }
  }
})

module.exports = { GoodsInfo }
