const asyncHandler = require('../middleware/async-handler');
const {Book, Cart} = require('../models/index');
const cloudinaryHandler = require('../utils/coudinary-handler');

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
  const {limit, page, sort, minPrice, maxPrice, status, name, ...query} = req.query;

  let sortBy;
  if (sort) {
    sortBy = sort.split(',').join(' ');
  }
  const filters = [];
  //  these lines prevent two things :
  //  1.the user entering strings not numbers thus the || 10 since the or get the first truthy value
  //  2.it limits the maximum of what a user can ask in the limit to not dump the whole db
  //  3.it also prevnts the limit from being under 1 and for page to be negative

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
  if (query)filters.push(query);
  const finalQuery = filters.length > 0 ? {$and: filters} : {};
  console.log(finalQuery);
  const books = await Book.find(finalQuery)
    .populate('authorId', 'name bio -_id')
    .populate('categories', 'name  -_id')
    .sort(sortBy || {createdAt: -1})
    .skip((pageQuery - 1) * limitQuery)
    .limit(limitQuery);

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

  const result = await cloudinaryHandler.cloudinaryUploader(req.file);
  body.coverImage = result.secure_url;
  body.coverImagePublicId = result.public_id;
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

  const result = await cloudinaryHandler.cloudinaryUploader(req.file);
  console.log(result);
  body.coverImage = result.secure_url;
  body.coverImagePublicId = result.public_id;
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
    const result = await cloudinaryHandler.cloudinaryUploader(req.file);
    body.coverImage = result.secure_url;
    body.coverImagePublicId = result.public_id;
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
  Cart.updateMany({});
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
