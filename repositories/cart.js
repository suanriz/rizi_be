const { dataSource } = require('../db/data-source')

const cartRepository = {
  findByUserId (userId) {
    return dataSource.query(`
      SELECT ci.goods_id, ci.count, g.name, g.link, g.price, g.sale,
        gcm.category_id AS type, cover_img.path AS img,
        COALESCE(array_agg(DISTINCT gtm.tags_id) FILTER (WHERE gtm.tags_id IS NOT NULL), '{}') AS tags
      FROM cart_items ci
      INNER JOIN goods g ON g.id = ci.goods_id AND g.status = true
      INNER JOIN goods_category_maps gcm ON gcm.goods_id = g.id
      INNER JOIN goods_imgs_maps cover_map ON cover_map.goods_id = g.id AND cover_map.cover = true
      INNER JOIN goods_imgs cover_img ON cover_img.id = cover_map.goods_imgs_id
      LEFT JOIN goods_tags_maps gtm ON gtm.goods_id = g.id
      WHERE ci.user_id = $1
      GROUP BY ci.id, g.id, gcm.category_id, cover_img.path
      ORDER BY ci.created_at ASC
    `, [userId])
  },

  async add (userId, goodsId) {
    const rows = await dataSource.query(`
      INSERT INTO cart_items (user_id, goods_id, count, created_at, updated_at)
      SELECT $1, g.id, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM goods g
      WHERE g.id = $2 AND g.status = true
      ON CONFLICT (user_id, goods_id)
      DO UPDATE SET count = LEAST(cart_items.count + 1, 999), updated_at = CURRENT_TIMESTAMP
      RETURNING goods_id, count
    `, [userId, goodsId])
    return rows[0] || null
  },

  async updateCount (userId, goodsId, count) {
    const rows = await dataSource.query(`
      UPDATE cart_items
      SET count = $3, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND goods_id = $2
      RETURNING goods_id, count
    `, [userId, goodsId, count])
    return rows[0] || null
  },

  async remove (userId, goodsId) {
    const result = await dataSource.getRepository('CartItem').delete({ userId, goodsId })
    return result.affected > 0
  }
}

module.exports = { cartRepository }
