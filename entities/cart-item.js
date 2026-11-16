const { EntitySchema } = require('typeorm')

const CartItem = new EntitySchema({
  name: 'CartItem',
  tableName: 'cart_items',
  indices: [
    { name: 'uq_cart_items_user_goods', columns: ['userId', 'goodsId'], unique: true },
    { name: 'idx_cart_items_user_id', columns: ['userId'] }
  ],
  checks: [
    { name: 'chk_cart_items_count', expression: '"count" BETWEEN 1 AND 999' }
  ],
  columns: {
    id: { type: 'integer', primary: true, generated: 'increment' },
    userId: { name: 'user_id', type: 'uuid' },
    goodsId: { name: 'goods_id', type: 'integer' },
    count: { type: 'integer' },
    createdAt: { name: 'created_at', type: 'timestamptz', createDate: true },
    updatedAt: { name: 'updated_at', type: 'timestamptz', updateDate: true }
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: { name: 'user_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_cart_items_user_id_users' },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    goods: {
      type: 'many-to-one',
      target: 'Goods',
      joinColumn: { name: 'goods_id', referencedColumnName: 'id', foreignKeyConstraintName: 'fk_cart_items_goods_id_goods' },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})

module.exports = { CartItem }
