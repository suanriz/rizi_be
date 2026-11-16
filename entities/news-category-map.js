const { EntitySchema } = require('typeorm')
const NewsCategoryMap = new EntitySchema({
  name: 'NewsCategoryMap',
  tableName: 'news_category_maps',
  columns: {
    id: {
      type: 'integer',
      primary: true,
      generated: 'increment'
    },
    newsId: {
      name: 'news_id',
      type: 'integer'
    },
    newsCategoryId: {
      name: 'news_category_id',
      type: 'integer'
    }
  },
  relations: {
    news: {
      type: 'many-to-one',
      target: 'News',
      joinColumn: {
        name: 'news_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_news_category_maps_news_id_news'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'CASCADE'
    },
    newsCategory: {
      type: 'many-to-one',
      target: 'NewsCategory',
      joinColumn: {
        name: 'news_category_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'fk_news_category_maps_news_category_id_news_categories'
      },
      nullable: false,
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  }
})
module.exports = { NewsCategoryMap }
