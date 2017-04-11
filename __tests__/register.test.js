/* eslint-env jest */
process.env.NODE_ENV = 'test'

const server = require('../app')
const request = require('supertest')(server.callback())
const { alice, setup } = require('../test-setup')

describe('Register', () => {
  beforeAll(async () => {
    await setup()
  })
  describe('POST /users', () => {
    it('should post a user', async () => {
      await request.post('/users').send(alice).expect(201)
    })
  })

  describe('POST /users (with a invalid email address)', () => {
    it('should get 422 response', async () => {
      await request.post('/users')
        .send({
          username: 'peter',
          password: 'peterpassword',
          email: 'abc'
        })
        .expect(422)
    })
  })

  describe('POST /users (without password)', () => {
    it('should get 422 response', async () => {
      await request.post('/users')
        .send({
          username: 'peter',
          email: 'abc@abc.com'
        })
        .expect(422)
    })
  })
})
