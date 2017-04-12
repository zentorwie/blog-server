async function getPageByIndex (model, projection, pageIndex, pageSize, sort) {
  if (!pageIndex) pageIndex = 1
  if (!pageSize) pageSize = 20
  if (pageSize > 100) pageSize = 100

  const totalCount = await model.count({})

  let firstPageIndex = 1
  let lastPageIndex = Math.floor((totalCount + pageSize) / pageSize)

  // if (pageIndex < firstPageIndex) pageIndex = firstPageIndex
  // if (pageIndex > lastPageIndex) pageIndex = lastPageIndex
  const skip = pageSize * (pageIndex - 1)
  // let prevPageIndex = pageIndex - 1
  // let nextPageIndex = pageIndex + 1
  const items = await model.find({}, projection, { limit: pageSize, skip: skip, sort: sort })

  let pagination = {
    pageIndex,
    pageSize,
    firstPageIndex,
    lastPageIndex,
    count: items.length,
    totalCount
  }

  return {
    items,
    pagination
  }
}

async function getNewestPageByCursor (model, projection, cursor, pageSize) {
  if (!cursor) cursor = new Date()
  if (!pageSize) pageSize = 20
  const totalCount = await model.count({})

  if (pageSize > 100) pageSize = 100

  const items = await model.find({ createdAt: { $lt: cursor } }, projection, { limit: pageSize, sort: '-createdAt' })

  let pagination = {
    pageSize,
    count: items.length,
    totalCount
  }

  if (items.length !== 0) {
    pagination.lastCursor = items[items.length - 1].createdAt
  }

  return {
    items,
    pagination
  }
}

exports.getPageByIndex = getPageByIndex
exports.getNewestPageByCursor = getNewestPageByCursor
