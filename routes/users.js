const User = require('../models/user')
const Router = require('koa-router')
const router = new Router()
const validator = require('validator')

router.post('/users', async (ctx) => {
  let userParam = ctx.request.body
  let newUser = new User(userParam)
  let result = await newUser.save()
  ctx.status = 201
  ctx.body = result
})

router.get('/users', async (ctx) => {
  if (!ctx.state.user) {
    ctx.throw(401)
  }
  let users = await User.find({}, 'id username email gender createdAt')
  ctx.status = 200
  ctx.body = users
})

router.get('/users/:userId', async (ctx) => {
  let userId = ctx.params.userId
  let valid = await validator.isMongoId(userId)
  if (!valid) {
    ctx.throw(404, new Error('User not found'))
  }

  let user = await User.findOne({ _id: ctx.params.userId },
    'id username gender email verifiedEmail createdAt updatedAt')
  ctx.status = 200
  ctx.body = user
})

module.exports = router
