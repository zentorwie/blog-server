const Article = require('../models/article')
const Router = require('koa-router')

const router = new Router()

router.all('abc', async (ctx, next) => {
  console.log('root')
})

router.get('/articles', async (ctx, next) => {
  let articles = await Article.find({})
  ctx.response.body = articles
})

router.get('/articles/:articleId', async (ctx, next) => {
  let article = await Article.findOne({ _id: ctx.params.articleId })
  if (!article) {
    ctx.throw(404, new Error('Article not found'))
  }
})

module.exports = router
