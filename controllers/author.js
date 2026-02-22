const asyncHandler = require('../middleware/async-handler');
const {Author} = require('../models/index');

const findAllAuthors = asyncHandler(async (req, res, next) => {
  //  these lines prevent two things :
  //  1.the user entering strings not numbers thus the || 10 since the or get the first truthy value
  //  2.it limits the maximum of what a user can ask in the limit to not dump the whole db
  //  3.it also prevnts the limit from being under 1 and for page to be negative
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);

  // TODO: handle qureies

  const name = req.query.name;

  const authors = await Author.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  if (!authors.length) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(200).json({status: 'Success', data: authors});
});

const findAuthorById = asyncHandler(async (req, res, next) => {
  const {id} = req.params;

  const author = await Author.findById(id);
  if (!author) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(200).json({status: 'Success', data: author});
});

const createAuthor = asyncHandler(async (req, res) => {
  const {body} = req;
  const author = await Author.create(body);
  res.status(201).json({status: 'Success', data: author});
});
const replaceAuthor = asyncHandler(async (req, res, next) => {
  const {body} = req;
  const {id} = req.params;

  const author = await Author.findOneAndReplace({_id: id}, body, {returnDocument: 'after', runValidators: true});
  if (!author) {
    const err = new Error('No author found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: author});
});

const updateAuthor = asyncHandler(async (req, res, next) => {
  const {body} = req;
  const {id} = req.params;

  const author = await Author.findOneAndUpdate({_id: id}, body, {returnDocument: 'after', runValidators: true});
  if (!author) {
    const err = new Error('No author found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: author});
});

const deleteAuthor = asyncHandler(async (req, res, next) => {
  const {id} = req.params;

  const author = await Author.findOneAndDelete({_id: id});
  if (!author) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(201).json({status: 'Success', data: author});
});
module.exports = {
  findAllAuthors,
  findAuthorById,
  createAuthor,
  updateAuthor,
  replaceAuthor,
  deleteAuthor

};
