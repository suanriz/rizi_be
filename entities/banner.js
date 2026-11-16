const { EntitySchema } = require('typeorm')
const Banner = new EntitySchema({
  name: 'Banner',
  tableName: 'banners',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    img: {
      type: 'varchar',
      length: 255
    },
    name: {
      type: 'varchar',
      length: 20
    },
    link: {
      type: 'varchar',
      length: 50
    },
    status: {
      type: 'boolean'
    },
    sequence: {
      type: 'integer'
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz'
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz'
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
        foreignKeyConstraintName: 'fk_banners_updated_by_users'
      },
      nullable: true,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { Banner }
