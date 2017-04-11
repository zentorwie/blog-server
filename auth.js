const config = require('./config')
const jwt = require('koa-jwt')

module.exports = jwt({ secret: config.secret })
