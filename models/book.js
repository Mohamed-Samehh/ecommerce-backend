const {func} = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
    maxLength: 200,
    trim: true
  },
  coverImage: {
    type: String,
    required: true,
    validate: {validator: urlValidator, message: 'invalid image url'}
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  authorId: {
    type: mongoose.ObjectId,
    ref: 'Author',
    required: true
  },
  categories: {
    type: [String],
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 2000,
    trim: true
  }

}, {toJSON: {virtuals: true, transform(doc, ret, options) {
  delete ret.__v;
  return ret;
}}, timestamps: true});

bookSchema.virtual('status').get(function () {
  if (this.stock > 2) {
    return 'avaliable';
  } else if (this.stock === 0) {
    return 'out of stock';
  } else {
    return 'low stock';
  }
});

bookSchema.virtual('averageRating').get(function () {
  const x = this;
  // TODO: implement rating by getting the reviews and calculating the average
  return 0;
});
bookSchema.virtual('review count').get(function () {
  const x = this;

  // TODO: implement by counting reviews
  return 0;
});
/**
 *
 * @param {string} value - the value of the url
 * @returns {RegExpMatchArray | null } - returns the array with matched expression or null if there isnt any
 */
function urlValidator(value) {
  return value.match(/^https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-\w@:%+.~#?&/=]*)$/);
}

// async function uniqueValidator(value) {
//   const product = await mongoose.models.Products.findOne({name: value});
//   return !product;
// }
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
