const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const mongoose = require('mongoose')
const config = require('./config')
const router = require('./router')
const logger = require('koa-logger')
const errorHandler = require('./error')
const jwt = require('koa-jwt')
const User = require('./models/user')

const app = new Koa()

let database = config.DBHost

if (process.env.NODE_ENV === 'test') {
  database = config.testDBHost
} else {
  // logger
  app.use(logger())
}

mongoose.Promise = global.Promise
mongoose.connect(database, {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
})

app.use(bodyParser())

app.use(errorHandler())

app.use(jwt({ secret: config.secret, passthrough: true, key: 'auth', tokenKey: 'token' }))
// TODO 如果用户拿到token以后，在数据库中找不到该用户 的处理

app.use(async (ctx, next) => {
  if (ctx.state.auth) {
    let user = await User.findOne({ _id: ctx.state.auth.id })
    ctx.state.user = user
  }
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

module.exports = app
