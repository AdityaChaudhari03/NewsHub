// models/Article.js

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  source: {
    id: { type: String },
    name: { type: String }
  },
  author: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  urlToImage: { type: String },
  publishedAt: { type: Date },
  content: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
