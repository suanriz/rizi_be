const appError = require('../utils/appError')

const invalidInput = (details) => {
  const error = appError(400, 'Invalid goods data')
  error.details = details
  return error
}

const validateId = (value) => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw appError(400, 'Goods id must be a positive integer')
  }
  return id
}

const validateGoodsListQuery = (query) => {
  const page = query.page === undefined ? 1 : Number(query.page)
  const pageSize = query.pageSize === undefined ? 8 : Number(query.pageSize)
  const type = query.type === undefined || Number(query.type) === 0 ? null : Number(query.type)
  const keyword = typeof query.keyword === 'string' ? query.keyword.trim() : ''

  if (!Number.isInteger(page) || page < 1) {
    throw appError(400, 'Page must be a positive integer')
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw appError(400, 'Page size must be between 1 and 100')
  }
  if (type !== null && (!Number.isInteger(type) || type < 1)) {
    throw appError(400, 'Type must be a positive integer')
  }
  if (keyword.length > 50) {
    throw appError(400, 'Keyword must be at most 50 characters')
  }

  return { page, pageSize, type, keyword }
}

const validateGoodsInput = (body) => {
  const source = body && typeof body === 'object' ? body : {}
  const values = {
    name: typeof source.title === 'string' ? source.title.trim() : '',
    link: typeof source.link === 'string' ? source.link.trim() : '',
    price: Number(source.price),
    sale: Number(source.onSale),
    categoryId: Number(source.category),
    tagIds: Array.isArray(source.tag) ? [...new Set(source.tag.map(Number))] : [],
    cover: typeof source.cover === 'string' ? source.cover.trim() : '',
    otherImages: Array.isArray(source.otherImgs)
      ? [...new Set(source.otherImgs.map((path) => typeof path === 'string' ? path.trim() : ''))]
      : [],
    status: source.status === 1 || source.status === true,
    flavor: typeof source.flavor === 'string' ? source.flavor.trim() : '',
    flavorDetail: typeof source.flavorDetail === 'string' ? source.flavorDetail.trim() : '',
    roast: typeof source.roast === 'string' ? source.roast.trim() : '',
    acidity: Number(source.acidity),
    info: typeof source.info === 'string' ? source.info.trim() : ''
  }
  const details = []

  if (!values.name || values.name.length > 50) details.push({ field: 'title', message: 'Title is required and must be at most 50 characters' })
  if (!values.link || values.link.length > 255) details.push({ field: 'link', message: 'Link is required and must be at most 255 characters' })
  if (!Number.isInteger(values.price) || values.price < 0) details.push({ field: 'price', message: 'Price must be a non-negative integer' })
  if (!Number.isInteger(values.sale) || values.sale < 0 || values.sale > values.price) details.push({ field: 'onSale', message: 'Sale must be a non-negative integer no greater than price' })
  if (!Number.isInteger(values.categoryId) || values.categoryId < 1) details.push({ field: 'category', message: 'Category must be a positive integer' })
  if (values.tagIds.some((id) => !Number.isInteger(id) || id < 1)) details.push({ field: 'tag', message: 'Every tag must be a positive integer' })
  if (!values.cover || values.cover.length > 255) details.push({ field: 'cover', message: 'Cover path is required and must be at most 255 characters' })
  if (values.otherImages.length !== 4 || values.otherImages.some((path) => !path || path.length > 255)) details.push({ field: 'otherImgs', message: 'Exactly four valid image paths are required' })
  if (values.otherImages.includes(values.cover)) details.push({ field: 'otherImgs', message: 'Cover path must not be duplicated in other images' })
  if (!values.flavor || values.flavor.length > 255) details.push({ field: 'flavor', message: 'Flavor is required and must be at most 255 characters' })
  if (!values.flavorDetail || values.flavorDetail.length > 255) details.push({ field: 'flavorDetail', message: 'Flavor detail is required and must be at most 255 characters' })
  if (!values.roast || values.roast.length > 255) details.push({ field: 'roast', message: 'Roast is required and must be at most 255 characters' })
  if (!Number.isInteger(values.acidity) || values.acidity < 1 || values.acidity > 5) details.push({ field: 'acidity', message: 'Acidity must be an integer between 1 and 5' })
  if (!values.info) details.push({ field: 'info', message: 'Info is required' })

  if (details.length > 0) throw invalidInput(details)
  return values
}

module.exports = { validateId, validateGoodsListQuery, validateGoodsInput }
