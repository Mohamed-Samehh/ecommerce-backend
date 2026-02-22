const asyncHandler = require('../middleware/async-handler');
const {Book} = require('../models/index');
/**
 * find all books with pagenation
 * @param {Request} req - user request
 * @param {Response} res - response object
 * @param {NextFunction} next -next middle ware pointer
 */
const findAllBooks = asyncHandler(async (req, res, next) => {
  //  these lines prevent two things :
  //  1.the user entering strings not numbers thus the || 10 since the or get the first truthy value
  //  2.it limits the maximum of what a user can ask in the limit to not dump the whole db
  //  3.it also prevnts the limit from being under 1 and for page to be negative
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  // TODO: handle qureies
  const category = req.query.category;
  const author = req.query.author;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const name = req.query.name;
  const sort = req.query.sort;

  const books = await Book.find({})
    .skip((page - 1) * limit)
    .limit(limit);

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

  const book = await Book.findById(id);
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

  const book = await Book.findOneAndReplace({_id: id}, body, {runValidators: true});
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

  const book = await Book.findOneAndUpdate({_id: id}, body, {runValidators: true});
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

  const book = await Book.findOneAndDelete({_id: id});
  if (!book) {
    const err = new Error('No books found');
    err.name = 'BookNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: book});
});

module.exports = {
  findAllBooks,
  findBookById,
  createBook,
  replaceBook,
  updateBook,
  deleteBook
};
