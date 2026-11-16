const { dataSource } = require('../db/data-source')

const goodsRepository = {
  async findPublicList ({ type, page, pageSize }) {
    const offset = (page - 1) * pageSize
    const params = [type, pageSize, offset]
    const [list, countRows] = await Promise.all([
      dataSource.query(`
        SELECT g.id, g.name, g.link, g.price, g.sale,
          gcm.category_id AS type,
          cover_img.path AS img,
          COALESCE(array_agg(DISTINCT gtm.tags_id) FILTER (WHERE gtm.tags_id IS NOT NULL), '{}') AS tags
        FROM goods g
        INNER JOIN goods_category_maps gcm ON gcm.goods_id = g.id
        INNER JOIN goods_imgs_maps cover_map ON cover_map.goods_id = g.id AND cover_map.cover = true
        INNER JOIN goods_imgs cover_img ON cover_img.id = cover_map.goods_imgs_id
        LEFT JOIN goods_tags_maps gtm ON gtm.goods_id = g.id
        WHERE g.status = true AND ($1::integer IS NULL OR gcm.category_id = $1)
        GROUP BY g.id, gcm.category_id, cover_img.path
        ORDER BY g.id ASC
        LIMIT $2 OFFSET $3
      `, params),
      dataSource.query(`
        SELECT COUNT(DISTINCT g.id)::integer AS total
        FROM goods g
        INNER JOIN goods_category_maps gcm ON gcm.goods_id = g.id
        WHERE g.status = true AND ($1::integer IS NULL OR gcm.category_id = $1)
      `, [type])
    ])
    return { list, total: countRows[0].total }
  },

  async findPublicDetailById (id) {
    const rows = await dataSource.query(`
      SELECT g.id, g.name, g.link, g.price, g.sale,
        gcm.category_id AS type,
        cover_img.path AS img,
        gi.flavor, gi.flavor_detail, gi.roast, gi.acidity, gi.info,
        COALESCE(array_agg(DISTINCT gtm.tags_id) FILTER (WHERE gtm.tags_id IS NOT NULL), '{}') AS tags
      FROM goods g
      INNER JOIN goods_infos gi ON gi.goods_id = g.id
      INNER JOIN goods_category_maps gcm ON gcm.goods_id = g.id
      INNER JOIN goods_imgs_maps cover_map ON cover_map.goods_id = g.id AND cover_map.cover = true
      INNER JOIN goods_imgs cover_img ON cover_img.id = cover_map.goods_imgs_id
      LEFT JOIN goods_tags_maps gtm ON gtm.goods_id = g.id
      WHERE g.id = $1 AND g.status = true
      GROUP BY g.id, gcm.category_id, cover_img.path, gi.id
    `, [id])
    if (!rows[0]) return null

    const images = await dataSource.query(`
      SELECT image.path
      FROM goods_imgs_maps map
      INNER JOIN goods_imgs image ON image.id = map.goods_imgs_id
      WHERE map.goods_id = $1
      ORDER BY map.cover DESC, map.id ASC
    `, [id])
    return { ...rows[0], images: images.map((image) => image.path) }
  },

  findById (id) {
    return dataSource.getRepository('Goods').findOneBy({ id })
  },

  async create (input, updatedById) {
    return dataSource.transaction((manager) => saveGoods(manager, input, updatedById))
  },

  async update (id, input, updatedById) {
    return dataSource.transaction((manager) => saveGoods(manager, input, updatedById, id))
  }
}

const saveGoods = async (manager, input, updatedById, id) => {
  const goodsRepo = manager.getRepository('Goods')
  const infoRepo = manager.getRepository('GoodsInfo')
  const categoryRepo = manager.getRepository('GoodsCategory')
  const categoryMapRepo = manager.getRepository('GoodsCategoryMap')
  const tagRepo = manager.getRepository('GoodsTag')
  const tagMapRepo = manager.getRepository('GoodsTagMap')
  const imageRepo = manager.getRepository('GoodsImg')
  const imageMapRepo = manager.getRepository('GoodsImgMap')

  if (!await categoryRepo.existsBy({ id: input.categoryId })) return { error: 'category' }
  for (const tagId of input.tagIds) {
    if (!await tagRepo.existsBy({ id: tagId })) return { error: 'tag', value: tagId }
  }

  const now = new Date()
  const existing = id ? await goodsRepo.findOneBy({ id }) : null
  if (id && !existing) return { error: 'not_found' }
  const goods = await goodsRepo.save({
    ...(existing || {}),
    updatedById,
    name: input.name,
    link: input.link,
    price: input.price,
    sale: input.sale,
    stock: existing?.stock ?? 0,
    status: input.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  })

  const existingInfo = await infoRepo.findOneBy({ goodsId: goods.id })
  await infoRepo.save({
    ...(existingInfo || {}),
    goodsId: goods.id,
    updatedById,
    flavor: input.flavor,
    flavorDetail: input.flavorDetail,
    roast: input.roast,
    acidity: input.acidity,
    info: input.info
  })

  await categoryMapRepo.delete({ goodsId: goods.id })
  await categoryMapRepo.save({ goodsId: goods.id, categoryId: input.categoryId })
  await tagMapRepo.delete({ goodsId: goods.id })
  if (input.tagIds.length > 0) {
    await tagMapRepo.save(input.tagIds.map((tagsId) => ({ goodsId: goods.id, tagsId })))
  }

  await imageMapRepo.delete({ goodsId: goods.id })
  for (const path of [input.cover, ...input.otherImages]) {
    let image = await imageRepo.findOneBy({ path })
    if (!image) image = await imageRepo.save({ path })
    await imageMapRepo.save({ goodsId: goods.id, goodsImgsId: image.id, cover: path === input.cover })
  }

  return { goods }
}

module.exports = { goodsRepository }
