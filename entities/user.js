const { EntitySchema } = require('typeorm')

const User = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    accountType: {
      name: 'account_type',
      type: 'varchar',
      length: 255
    },
    email: {
      type: 'varchar',
      length: 50,
      unique: true
    },
    name: {
      type: 'varchar',
      length: 20,
      nullable: true
    },
    status: {
      type: 'boolean'
    },
    remark: {
      type: 'varchar',
      length: 255,
      nullable: true
    },
    password: {
      type: 'varchar',
      length: 255
    },
    lastLoginAt: {
      name: 'last_login_at',
      type: 'timestamptz',
      nullable: true
    },
    roleId: {
      name: 'role_id',
      type: 'integer',
      nullable: true
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
        foreignKeyConstraintName: 'fk_users_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    },
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_users_role_id_roles'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})

module.exports = { User }
