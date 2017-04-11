const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  abstract: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

articleSchema.pre('save', next => {
  let now = new Date()
  if (!this.createdAt) {
    this.createdAt = now
  }
  this.updatedAt = now
  next()
})

articleSchema.query.byName = name =>
  this.find({
    name: new RegExp(name, 'i')
  })

// articleSchema.set('toObject', { retainKeyOrder: true });

const Article = mongoose.model('Article', articleSchema)

module.exports = Article
