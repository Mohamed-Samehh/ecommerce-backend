const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async-handler');
const {Book} = require('../models/index');
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
  const {limit, page, sort, minPrice, maxPrice, status, name, categories, authorId} = req.query;

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
    const castedCategories = new mongoose.Types.ObjectId(categories);
    filters.push({categories: castedCategories});
  }
  if (authorId) {
    const castedAuthorId = new mongoose.Types.ObjectId(authorId);
    filters.push({authorId: castedAuthorId});
  }
  filters.push({isDeleted: false});
  const finalQuery = filters.length > 0 ? {$and: filters} : {};
  const books = await Book.aggregate([
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
        categoryies: {$map: {input: '$categories', as: 'cat', in: '$$cat.name'}},
        author: {$arrayElemAt: ['$author.name', 0]},
        averageRating: {$ifNull: [{$avg: '$review.rating'}, 0]},
        reviewCount: {$size: '$review'},
        status: {
          $cond: {if: {$gt: ['$stock', 2]}, then: 'avaliable', else: {$cond: {if: {$eq: ['$stock', 0]}, then: 'out of stock', else: 'low stock'}}}
        }
      }

    },
    {
      $project: {
        review: 0,
        isDeleted: 0,
        authorId: 0,
        categories: 0

      }
    },
    {$sort: sortBy},
    {$skip: (pageQuery - 1) * limitQuery},
    {$limit: limitQuery}

  ]);

  if (!books.length) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(200).json({status: 'Success', data: books});
});
/**
 * find  book by id
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const findBookById = asyncHandler(async (req, res, next) => {
  const {id} = req.params;

  const book = await Book.findById(id)
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(200).json({status: 'Success', data: book});
});
/**
 * creates a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const createBook = asyncHandler(async (req, res) => {
  const {body} = req;

  body.coverImage = req.secure_url;
  body.coverImagePublicId = req.public_id;
  console.log(body.coverImage);
  console.log(body.coverImagePublicId);
  const book = await Book.create(body);

  res.status(201).json({status: 'Success', data: book});
});
/**
 * replace a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const replaceBook = asyncHandler(async (req, res, next) => {
  const {body} = req;
  const {id} = req.params;

  body.coverImage = req.secure_url;
  body.coverImagePublicId = req.public_id;
  console.log(body.coverImage);
  const book = await Book.findOneAndReplace({_id: id}, body, {returnDocument: 'after', runValidators: true})
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: book});
});
/**
 * update a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const updateBook = asyncHandler(async (req, res, next) => {
  const {body} = req;
  const {id} = req.params;

  if (req.file) {
    body.coverImage = req.secure_url;
    body.coverImagePublicId = req.public_id;
  }
  const book = await Book.findOneAndUpdate({_id: id}, body, {returnDocument: 'after', runValidators: true})
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: book});
});
/**
 * delete a book
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const deleteBook = asyncHandler(async (req, res, next) => {
  const {id} = req.params;
  const book = await Book.findOneAndUpdate({_id: id, isDeleted: false}, {isDeleted: true}, {returnDocument: 'after', runValidators: true})
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id');
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }

  res.status(200).json({status: 'Success', data: book});
});

module.exports = {
  findAllBooks,
  findBookById,
  createBook,
  replaceBook,
  updateBook,
  deleteBook
};
