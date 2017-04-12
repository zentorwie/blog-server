const Router = require('koa-router')
const router = new Router()
const jwt = require('jsonwebtoken')
const config = require('../config')
const User = require('../models/user')

router.post('/tokens', async (ctx) => {
  let username = ctx.request.body.username
  let password = ctx.request.body.password

  console.log(`USER LOGIN: ${username} ${password}`)
  if (username === undefined || password === undefined) {
    ctx.throw(401)
  }

  let user = await User.findOne({ username }, 'id username password')
  if (user === null || user.password !== password) {
    ctx.throw(401)
  }

  let token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: config.expiresInSecond
  })

  ctx.status = 200
  ctx.body = {
    token
  }
})

module.exports = router
