const appError = require('../utils/appError')

const toFrontendImage = (path) => {
  if (/^https?:\/\//.test(path)) return path
  const withoutExtension = path.replace(/^\//, '').replace(/\.(jpe?g|png|webp)$/i, '')
  return withoutExtension.startsWith('img/') ? withoutExtension : `img/${withoutExtension}`
}

const mapListItem = (item) => ({
  id: item.id,
  name: item.name,
  link: item.link,
  img: toFrontendImage(item.img),
  price: item.price,
  ...(item.sale < item.price ? { onSale: item.sale } : {}),
  type: item.type,
  tag: item.tags.map(Number)
})

const createGoodsService = ({ goodsRepository }) => ({
  async getList (query) {
    const result = await goodsRepository.findPublicList(query)
    return { list: result.list.map(mapListItem), total: result.total }
  },

  async getDetail (id) {
    const item = await goodsRepository.findPublicDetailById(id)
    if (!item) throw appError(404, 'Goods not found')
    return {
      ...mapListItem(item),
      detail: {
        imgs: item.images.map(toFrontendImage),
        features: {
          flavor: item.flavor,
          flavorDetail: item.flavor_detail,
          roast: item.roast,
          acidity: `${item.acidity}分`
        },
        info: item.info.split(/\r?\n/).filter(Boolean)
      }
    }
  },

  async create (input, updatedById) {
    const result = await goodsRepository.create(input, updatedById)
    handleWriteError(result)
    return { id: result.goods.id }
  },

  async update (id, input, updatedById) {
    const result = await goodsRepository.update(id, input, updatedById)
    handleWriteError(result)
    return { id: result.goods.id }
  },

  async remove (id) {
    const goods = await goodsRepository.findById(id)
    if (!goods) throw appError(404, 'Goods not found')
    throw appError(409, 'Goods cannot be deleted; set status to disabled instead')
  }
})

const handleWriteError = (result) => {
  if (result.error === 'not_found') throw appError(404, 'Goods not found')
  if (result.error === 'category') throw appError(400, 'Goods category does not exist')
  if (result.error === 'tag') throw appError(400, `Goods tag ${result.value} does not exist`)
}

module.exports = { createGoodsService, toFrontendImage, mapListItem }
