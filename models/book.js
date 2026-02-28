const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 200,
    trim: true
  },
  coverImage: {
    type: String,
    required: true,
    validate: { validator: urlValidator, message: 'invalid image url' }
  },
  coverImagePublicId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: 1,
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
    type: [mongoose.ObjectId],
    ref: 'Category',
    validate: { validator: uniqueCategory, message: 'categories must be unique' },
    required: true
  },
  description: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 2000,
    trim: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true, transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }, timestamps: true
});

bookSchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false }
  }
);

bookSchema.virtual('status').get(function () {
  if (this.stock > 2) {
    return 'available';
  } else if (this.stock === 0) {
    return 'out of stock';
  } else {
    return 'low stock';
  }
});

bookSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId',
  count: true
});
/**
 *
 * @param {string} value - the value of the url
 * @returns {RegExpMatchArray | null } - returns the array with matched expression or null if there isnt any
 */
function urlValidator(value) {
  return value.match(/^https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-\w@:%+.~#?&/=]*)$/);
}
/**
 * checks if the categories are unique
 * // we are conveting to string since mongoose id is an object , so same name object will have differnce refrences thus escaping the set check
 * @param {Array} value -the categories array
 * @returns {boolean} -returns true if the array has unique elements
 */
function uniqueCategory(value) {
  const stringIds = value.map((id) => id.toString());
  return new Set(stringIds).size === value.length;
};

bookSchema.statics.findAllBooks = async function (query) {
  try {
    const {limit, page, sort, minPrice, maxPrice, status, name, categories, authorId} = query;

    const allowedSortFields = {
      'price': {price: 1},
      '-price': {price: -1},
      'rating': {averageRating: 1},
      '-rating': {averageRating: -1},
      'name': {name: 1},
      '-name': {name: -1},
      'stock': {stock: 1},
      '-stock': {stock: -1},
      'newest': {createdAt: -1},
      'oldest': {createdAt: 1}
    };
    const sortBy = allowedSortFields[sort] || {createdAt: -1};
    const filters = [];

    const limitQuery = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const pageQuery = Math.max(Number(page) || 1, 1);

    let statusQuery;
    if (status) {
      if (status === 'available') {
        statusQuery = {stock: {$gt: 2}};
      } else if (status === 'out of stock') {
        statusQuery = {stock: {$eq: 0}};
      } else {
        statusQuery = {$and: [{stock: {$lt: 2}}, {stock: {$gt: 0}}]};
      }
    }
    if (minPrice)filters.push({price: {$gte: Number(minPrice)}});
    if (maxPrice)filters.push({price: {$lte: Number(maxPrice)}});
    if (statusQuery)filters.push(statusQuery);
    if (name) filters.push({name: {$regex: name, $options: 'i'}});
    if (categories) {
      const categoryArray = Array.isArray(categories) ? categories : [categories];
      const castedCategories = categoryArray.map((id) => new mongoose.Types.ObjectId(id));
      filters.push({categories: {$all: castedCategories}});
    }
    if (authorId) {
      const castedAuthorId = new mongoose.Types.ObjectId(authorId);
      filters.push({authorId: castedAuthorId});
    }
    filters.push({isDeleted: false});
    const finalQuery = filters.length > 0 ? {$and: filters} : {};
    const books = await this.aggregate([
      {
        $match: finalQuery
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categories',
          pipeline: [{$project: {_id: 0, name: 1}}]
        }
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author',
          pipeline: [{$project: {_id: 0, name: 1}}]
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'bookId',
          as: 'review'
        }
      },
      {

        $addFields: {
          categories: {$map: {input: '$categories', as: 'cat', in: '$$cat.name'}},
          author: {$arrayElemAt: ['$author.name', 0]},
          averageRating: {$ifNull: [{$avg: '$review.rating'}, 0]},
          reviewCount: {$size: '$review'},
          status: {
            $cond: {if: {$gt: ['$stock', 2]}, then: 'available', else: {$cond: {if: {$eq: ['$stock', 0]}, then: 'out of stock', else: 'low stock'}}}
          }
        }

      },
      {
        $project: {
          review: 0,
          authorId: 0,

          __v: 0

        }
      },
      {
        $facet: {
          metaData: [{$count: 'totalBooks'}],
          data: [
            {$sort: sortBy},
            {$skip: (pageQuery - 1) * limitQuery},
            {$limit: limitQuery}
          ]
        }
      },
      {
        $project: {
          data: 1,
          totalBooks: {$ifNull: [{$arrayElemAt: ['$metaData.totalBooks', 0]}, 0]}

        }
      }

    ]);

    return books[0];
  } catch (err) {
    throw new Error(`Error fetching books: ${err.message}`);
  }
};
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
