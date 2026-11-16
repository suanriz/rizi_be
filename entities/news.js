const { EntitySchema } = require('typeorm')
const News = new EntitySchema({
  name: 'News',
  tableName: 'news',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    title: {
      type: 'varchar',
      length: 255
    },
    content: {
      type: 'text'
    },
    img: {
      type: 'varchar',
      length: 255
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz'
    },
    status: {
      type: 'boolean'
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
        foreignKeyConstraintName: 'fk_news_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { News }
