const goodsSeedData = require('./data/goods.json')

const SEEDED_AT = new Date('2026-10-20T01:00:00.000Z')
const DEFAULT_STOCK = 100

const toImagePath = (path) => `/${path.replace(/^img\//, '')}.jpg`

const toSeedGoods = (goods) => goods.map((item) => ({
  id: item.id,
  name: item.name,
  link: `https://suanriz.github.io/rizi/store/${item.id}`,
  price: item.price,
  sale: item.onSale ?? item.price,
  stock: DEFAULT_STOCK,
  status: true,
  categoryId: item.type,
  tagIds: item.tag.map((tagId) => tagId + 1),
  cover: toImagePath(item.img),
  images: [...new Set(item.detail.imgs.map(toImagePath))],
  info: {
    flavor: item.detail.features.flavor,
    flavorDetail: item.detail.features.flavorDetail,
    roast: item.detail.features.roast,
    acidity: Number.parseInt(item.detail.features.acidity, 10),
    info: item.detail.info
  }
}))

const defaultGoods = toSeedGoods(goodsSeedData)

const seedGoods = async (dataSource, updatedById = null) => {
  await dataSource.transaction(async (manager) => {
    const goodsInfoRepository = manager.getRepository('GoodsInfo')
    const categoryRepository = manager.getRepository('GoodsCategory')
    const categoryMapRepository = manager.getRepository('GoodsCategoryMap')
    const tagRepository = manager.getRepository('GoodsTag')
    const tagMapRepository = manager.getRepository('GoodsTagMap')
    const imageRepository = manager.getRepository('GoodsImg')
    const imageMapRepository = manager.getRepository('GoodsImgMap')

    for (const item of defaultGoods) {
      const categoryExists = await categoryRepository.existsBy({ id: item.categoryId })
      if (!categoryExists) {
        throw new Error(`Goods category ${item.categoryId} does not exist`)
      }

      for (const tagId of item.tagIds) {
        const tagExists = await tagRepository.existsBy({ id: tagId })
        if (!tagExists) {
          throw new Error(`Goods tag ${tagId} does not exist`)
        }
      }

      await manager.query(`
        INSERT INTO goods
          (id, updated_by, name, link, price, sale, stock, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
        ON CONFLICT (id) DO UPDATE SET
          updated_by = EXCLUDED.updated_by,
          name = EXCLUDED.name,
          link = EXCLUDED.link,
          price = EXCLUDED.price,
          sale = EXCLUDED.sale,
          stock = EXCLUDED.stock,
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
      `, [
        item.id,
        updatedById,
        item.name,
        item.link,
        item.price,
        item.sale,
        item.stock,
        item.status,
        SEEDED_AT
      ])

      const existingInfo = await goodsInfoRepository.findOneBy({ goodsId: item.id })
      await goodsInfoRepository.save({
        ...(existingInfo ? { id: existingInfo.id } : {}),
        updatedById,
        goodsId: item.id,
        ...item.info
      })

      await categoryMapRepository.delete({ goodsId: item.id })
      await categoryMapRepository.save({ goodsId: item.id, categoryId: item.categoryId })

      await tagMapRepository.delete({ goodsId: item.id })
      if (item.tagIds.length > 0) {
        await tagMapRepository.save(item.tagIds.map((tagsId) => ({ goodsId: item.id, tagsId })))
      }

      await imageMapRepository.delete({ goodsId: item.id })
      for (const path of item.images) {
        let image = await imageRepository.findOneBy({ path })
        if (!image) {
          image = await imageRepository.save({ path })
        }
        await imageMapRepository.save({
          goodsId: item.id,
          goodsImgsId: image.id,
          cover: path === item.cover
        })
      }
    }

    await manager.query(
      "SELECT setval(pg_get_serial_sequence('goods', 'id'), COALESCE(MAX(id), 1), true) FROM goods"
    )
  })

  return defaultGoods.length
}

module.exports = { seedGoods, defaultGoods, toSeedGoods, DEFAULT_STOCK, SEEDED_AT }
