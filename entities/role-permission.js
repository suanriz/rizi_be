const { EntitySchema } = require('typeorm')
const RolePermission = new EntitySchema({
  name: 'RolePermission',
  tableName: 'role_permissions',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    permissionId: {
      name: 'permission_id',
      type: 'integer'
    },
    roleId: {
      name: 'role_id',
      type: 'integer'
    }
  },
  relations: {
    permission: {
      type: 'many-to-one',
      target: 'Permission',
      joinColumn: {
        name: 'permission_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_role_permissions_permission_id_permissions'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_role_permissions_role_id_roles'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    }
  }
})
module.exports = { RolePermission }
