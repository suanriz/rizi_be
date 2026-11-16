const { EntitySchema } = require('typeorm')
const Role = new EntitySchema({
  name: 'Role',
  tableName: 'roles',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    label: {
      type: 'varchar',
      length: 20
    },
    updatedById: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true
    }
  },
  relations: {
    updatedBy: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: {
        name: 'updated_by',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_roles_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Role }
