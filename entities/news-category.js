const { EntitySchema } = require('typeorm')

const NewsCategory = new EntitySchema({
  name: 'NewsCategory',
  tableName: 'news_categories',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    label: {
      type: 'varchar',
      length: 20
    }
  }
})
module.exports = { NewsCategory }
