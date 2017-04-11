/* eslint-env jest */
process.env.NODE_ENV = 'test'

const server = require('../app')
const request = require('supertest')(server.callback())
const { john, setup } = require('./../test-setup')

describe('Users', () => {
  let token
  beforeAll(async () => {
    await setup()
    token = john.token
  })

  describe('GET /users', () => {
    it('should return user list as array', async () => {
      let res = await request.get('/users').set('Authorization', `Bearer ${token}`).expect(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /users', () => {
    it('should not return password', async () => {
      let res = await request.get('/users').set('Authorization', `Bearer ${token}`).expect(200)
      expect(res.body).not.toHaveProperty('password')
    })
  })

  describe('GET /users/:userId', () => {
    it('should return a user object', async () => {
      let res = await request.get(`/users/${john.id}`).expect(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).toHaveProperty('username', john.username)
      expect(res.body).toHaveProperty('email', john.email)
      expect(res.body).toHaveProperty('gender', john.gender)
    })
  })

  describe('GET /users/:userId', () => {
    it('should return a user object without password', async () => {
      let res = await request.get(`/users/${john.id}`).expect(200)
      expect(res.body).toBeInstanceOf(Object)
      expect(res.body).not.toHaveProperty('password', 'password')
    })
  })

  describe('GET /users/:userId (with a non-existent userId)', () => {
    it('should return a user object', async () => {
      let res = await request.get(`/users/nonexistent`).expect(404)
      expect(res.body.message).toBe('User not found')
    })
  })
})
