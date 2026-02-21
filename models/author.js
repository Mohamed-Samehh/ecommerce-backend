const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    unique: true,
    minLength: [5],
    maxLength: [200],
    trim: true
  },
  bio: {
    type: String,
    required: [true],
    minLength: [5],
    maxLength: [500],
    trim: true
  }

}, {toJSON: {transform(doc, ret, options) {
  delete ret.__v;
  return ret;
}}}, {timestamps: true});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
