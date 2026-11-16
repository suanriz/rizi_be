const { EntitySchema } = require('typeorm')
const OrderItem = new EntitySchema({
  name: 'OrderItem',
  tableName: 'order_items',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    orderId: {
      name: 'order_id',
      type: 'uuid'
    },
    goodsId: {
      name: 'goods_id',
      type: 'integer'
    },
    price: {
      type: 'integer'
    },
    count: {
      type: 'integer'
    },
    totalPrice: {
      name: 'total_price',
      type: 'integer'
    },
    updatedById: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true
    }
  },
  relations: {
    order: {
      type: 'many-to-one',
      target: 'Order',
      joinColumn: {
        name: 'order_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_order_id_orders'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    },
    goods: {
      type: 'many-to-one',
      target: 'Goods',
      joinColumn: {
        name: 'goods_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_goods_id_goods'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    },
    updatedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'updated_by',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_order_items_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { OrderItem }
