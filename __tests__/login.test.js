/* eslint-env jest */
process.env.NODE_ENV = 'test'

const server = require('../app')
const request = require('supertest')(server.callback())
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config')

describe('Login', () => {
  let token
  let john = {
    username: 'john',
    password: 'password',
    gender: 'male',
    email: 'johnsmith@gmail.com'
  }

  beforeAll(async () => {
    await User.remove({})
    let johnUser = new User(john)
    let result = await johnUser.save()
    john.id = result._id
    token = jwt.sign({ id: john.id }, config.secret, { expiresIn: config.expiresInSecond })
  })

  describe('POST /tokens', () => {
    it('should return a token', async () => {
      let res = await request.post('/tokens').send(john).expect(200)
      expect(res.body.token).toBe(token)
    })
  })

  describe('GET /users with token', () => {
    it('should return user list', async () => {
      let res = await request.get('/users').set('Authorization', `Bearer ${token}`).expect(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /users without token', () => {
    it('should return 401', async () => {
      await request.get('/users').expect(401)
    })
  })

  describe('GET /users with wrong key', () => {
    it('should return 401', async () => {
      await request.get('/users').expect(401)
    })
  })
})
