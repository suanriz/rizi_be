const { EntitySchema } = require('typeorm')
const Goods = new EntitySchema({
  name: 'Goods',
  tableName: 'goods',
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
    name: {
      type: 'varchar',
      length: 50
    },
    link: {
      type: 'varchar',
      length: 255
    },
    price: {
      type: 'integer'
    },
    sale: {
      type: 'integer'
    },
    stock: {
      type: 'integer'
    },
    status: {
      type: 'boolean'
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz'
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz'
    }
  },
  relations: {
    updatedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'updated_by',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_goods_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Goods }
