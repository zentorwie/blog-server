const User = require('../models/user')
const Router = require('koa-router')
const router = new Router()
const validator = require('validator')
const utils = require('../utils')

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

  const result = await utils.getPageByIndex(User, {
    _id: 1,
    username: 1,
    email: 1,
    verifiedEmail: 1,
    gender: 1,
    createdAt: 1
  }, parseInt(ctx.query.pageIndex), parseInt(ctx.query.pageSize), '_id')

  ctx.status = 200
  ctx.body = result
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

router.post('/users/setup', async (ctx) => {
  for (let i = 0; i < 100; i++) {
    const user = new User({
      username: `user${i}`,
      password: 123456,
      email: `user${i}@g.com`,
      gender: 'unknown'
    })
    await user.save()
  }
  ctx.status = 201
})

module.exports = router
