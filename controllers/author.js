const asyncHandler = require('../middleware/async-handler');
const { Author, Book } = require('../models/index');

const findAllAuthors = asyncHandler(async (req, res, next) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 100);
  const page = Math.max(Number(req.query.page) || 1, 1);

  const authors = await Author.find({})
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ status: 'Success', data: authors });
});


const findAuthorById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const author = await Author.findById(id);
  if (!author) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(200).json({ status: 'Success', data: author });
});

const createAuthor = asyncHandler(async (req, res) => {
  const { body } = req;
  const author = await Author.create(body);
  res.status(201).json({ status: 'Success', data: author });
});
const replaceAuthor = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const author = await Author.findOneAndReplace({ _id: id }, body, { returnDocument: 'after', runValidators: true });
  if (!author) {
    const err = new Error('No author found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(201).json({ status: 'Success', data: author });
});

const updateAuthor = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { id } = req.params;

  const author = await Author.findOneAndUpdate({ _id: id }, body, { returnDocument: 'after', runValidators: true });
  if (!author) {
    const err = new Error('No author found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  res.status(201).json({ status: 'Success', data: author });
});

const deleteAuthor = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const author = await Author.findByIdAndDelete({ _id: id });
  if (!author) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  await Book.updateMany({ authorId: id }, { isDeleted: true });
  res.status(201).json({ status: 'Success', data: author });
});
module.exports = {
  findAllAuthors,
  findAuthorById,
  createAuthor,
  updateAuthor,
  replaceAuthor,
  deleteAuthor

};
