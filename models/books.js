const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    minLength: [5, 'A name must be at least 5 char'],
    maxLength: [20, 'A name must be at most 20 char']
  },
  coverImage: {
    type: String,
    required: [true, 'an image is required']
  },
  price: {
    type: Number,
    required: [true, 'must enter a price']
  },
  authorId: {
    type: String,
    required: [true, 'must have an author']
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  categories: {
    type: [String],
    default: 'General'
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
const Books = mongoose.model('Booksa', bookSchema);

module.exports = Books;
