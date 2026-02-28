const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async-handler');
const { Book } = require('../models/index');
// const uploadImage = async () => {
//   const result = await cloudinary.uploader.upload('path-to-your-image');
//   const url = cloudinary.url(result.public_id);
// };

/**
 * find all books with pagenation
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const findAllBooks = asyncHandler(async (req, res, next) => {
  const { data, totalBooks } = await Book.findAllBooks(req.query);

  if (!data.length) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }

  const currentPage = Number(req.query.page) || 1;
  const pageSize = Number(req.query.limit) || 10;
  res.status(200).json({ status: 'Success', data, totalBooks, currentPage, pageSize });
});
/**
 * find  book by id
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const findBookById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bookId = new mongoose.Types.ObjectId(id);
  const result = await Book.aggregate([
    {
      $match: { _id: bookId, isDeleted: false }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
        pipeline: [{ $project: { name: 1 } }]
      }
    },
    {
      $lookup: {
        from: 'authors',
        localField: 'authorId',
        foreignField: '_id',
        as: 'authorId',
        pipeline: [{ $project: { name: 1, bio: 1 } }]
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
        averageRating: { $ifNull: [{ $avg: '$review.rating' }, 0] },
        reviewCount: { $size: '$review' },
        authorId: { $arrayElemAt: ['$authorId', 0] }
      }
    },
    {
      $project: {
        review: 0
      }
    }
  ]);

  if (!result || result.length === 0) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }

  // To maintain compatibility with frontend (which expects id instead of _id)
  const book = result[0];
  book.id = book._id;

  res.status(200).json({ status: 'Success', data: book });
});
/**
 * creates a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const createBook = asyncHandler(async (req, res) => {
  const { body } = req;

  body.coverImage = req.secure_url;
  body.coverImagePublicId = req.public_id;
  console.log(body.coverImage);
  console.log(body.coverImagePublicId);
  const book = await Book.create(body);

  res.status(201).json({ status: 'Success', data: book });
});
/**
 * replace a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const replaceBook = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  body.coverImage = req.secure_url;
  body.coverImagePublicId = req.public_id;
  console.log(body.coverImage);
  const book = await Book.findOneAndReplace({ _id: id }, body, { returnDocument: 'after', runValidators: true })
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(201).json({ status: 'Success', data: book });
});
/**
 * update a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const updateBook = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  if (req.file) {
    body.coverImage = req.secure_url;
    body.coverImagePublicId = req.public_id;
  }
  const book = await Book.findOneAndUpdate({ _id: id }, body, { returnDocument: 'after', runValidators: true })
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(201).json({ status: 'Success', data: book });
});
/**
 * delete a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const deleteBook = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { returnDocument: 'after', runValidators: true })
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }

  res.status(200).json({ status: 'Success', data: book });
});

module.exports = {
  findAllBooks,
  findBookById,
  createBook,
  replaceBook,
  updateBook,
  deleteBook
};
