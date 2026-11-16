const { EntitySchema } = require('typeorm')
const Permission = new EntitySchema({
  name: 'Permission',
  tableName: 'permissions',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    name: {
      type: 'varchar',
      length: 50
    },
    code: {
      type: 'varchar',
      length: 50,
      unique: true
    },
    sort: {
      type: 'integer'
    },
    pageId: {
      name: 'page_id',
      type: 'integer'
    },
    updatedById: {
      name: 'updated_by',
      type: 'uuid',
      nullable: true
    }
  },
  relations: {
    page: {
      type: 'many-to-one',
      target: 'Page',
      joinColumn: {
        name: 'page_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_permissions_page_id_pages'
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
        foreignKeyConstraintName: 'fk_permissions_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Permission }
