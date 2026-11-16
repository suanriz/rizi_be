const { EntitySchema } = require('typeorm')
const Page = new EntitySchema({
  name: 'Page',
  tableName: 'pages',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    name: {
      type: 'varchar',
      length: 15
    },
    path: {
      type: 'varchar',
      length: 50
    },
    icon: {
      type: 'varchar',
      length: 50
    },
    sort: {
      type: 'integer'
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
        foreignKeyConstraintName: 'fk_pages_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Page }
