const mongoose = require('mongoose')
const validator = require('validator')
// const config = require('../config')
// const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username already exists, please try another'],
    match: [/\w{3,16}/, 'Invalid username (4 - 16 characters long alphabetic and underscore)']
  },
  password: { /* TODO 密码加密 */
    type: String,
    required: [true, 'Password is required'],
    // match: [/[A-Za-z0-9_*]{8, 18}/, 'Invalid password format (8 - 18 characters']
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    validate: {
      isAsync: true,
      validator: validator.isEmail,
      message: 'Invalid email address'
    }
  },
  verifiedEmail: { type: Boolean, default: false },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  admin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

userSchema.pre('save', async (next) => {
  let user = this
  let now = new Date()
  if (!user.createdAt) {
    user.createdAt = now
  }
  user.updatedAt = now

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
