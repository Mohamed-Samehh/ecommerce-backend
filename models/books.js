const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true],
    unique: true,
    minLength: [5],
    maxLength: [200],
    trim: true
  },
  coverImage: {
    type: String,
    required: [true]
  },
  price: {
    type: Number,
    required: [true]
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  authorId: {
    type: String,
    required: [true]
  },
  categories: {
    type: [String],
    default: 'General'
  },
  description: {
    type: String,
    required: [true],
    minLength: [5],
    maxLength: [2000],
    trim: true
  }

}, {toJSON: {virtuals: true, transform(doc, ret, options) {
  delete ret.__v;
  return ret;
}}}, {timestamps: true});

bookSchema.virtual('status').get(function () {
  if (this.quantity > 2) {
    return 'avaliable';
  } else if (this.quantity === 0) {
    return 'out of stock';
  } else {
    return 'low stock';
  }
});
bookSchema.virtual('averageRating').get(() => {
  // TODO: implement rating by getting the reviews and calculating the average
  return 0;
});
bookSchema.virtual('review count').get(() => {
  // TODO: implement by counting reviews
  return 0;
});
// async function uniqueValidator(value) {
//   const product = await mongoose.models.Products.findOne({name: value});
//   return !product;
// }
const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
