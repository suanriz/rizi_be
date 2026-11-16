const { EntitySchema } = require('typeorm')
const Order = new EntitySchema({
  name: 'Order',
  tableName: 'orders',
  columns: {
    id: {
      type: 'uuid',
      primary: true
    },
    userId: {
      name: 'user_id',
      type: 'uuid'
    },
    updatedById: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true
    },
    totalPrice: {
      name: 'total_price',
      type: 'integer'
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz'
    },
    shippedAt: {
      name: 'shipped_at',
      type: 'timestamptz',
      nullable: true
    },
    completedAt: {
      name: 'completed_at',
      type: 'timestamptz',
      nullable: true
    },
    cancelledAt: {
      name: 'cancelled_at',
      type: 'timestamptz',
      nullable: true
    },
    orderStatusId: {
      name: 'order_status_id',
      type: 'integer'
    }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'user_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_orders_user_id_users'
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
        foreignKeyConstraintName: 'fk_orders_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    },
    orderStatus: {
      type: 'many-to-one',
      target: 'OrderStatus',
      joinColumn: {
        name: 'order_status_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_orders_order_status_id_order_statuses'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Order }
