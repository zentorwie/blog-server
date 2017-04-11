const Router = require('koa-router')
const rootRouter = new Router()

const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const tokenRouter = require('./routes/tokens')

const fuckRouter = new Router()

fuckRouter.all('/:fuck', (ctx) => {
  console.log('fuck')
  ctx.body = 'fuck'
})

rootRouter.use(articleRouter.routes(), articleRouter.allowedMethods())
rootRouter.use(userRouter.routes())
rootRouter.use(tokenRouter.routes())

module.exports = rootRouter
