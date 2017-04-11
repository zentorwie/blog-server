require('./app')
const User = require('./models/user')
const config = require('./config')
const jwt = require('jsonwebtoken')

let john = {
  username: 'john',
  password: 'password',
  gender: 'male',
  email: 'johnsmith@gmail.com'
}

let alice = {
  username: 'alice',
  password: 'palace',
  gender: 'female',
  email: 'alice@custom.com'
}

const setup = async () => {
  await User.remove({})
  let johnUser = new User(john)
  let result = await johnUser.save()
  john.id = result._id
  john.token = jwt.sign({ id: john.id }, config.secret, { expiresIn: config.expiresInSecond })
}

module.exports = {
  john, alice, setup
}
