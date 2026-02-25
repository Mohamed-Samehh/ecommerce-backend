const {Author, Category} = require('../models');

const validateAuthorExsists = async (req, res, next) => {
  const {body} = req;
  if (!body.authorId) return next();
  const author = await Author.findById(body.authorId);
  if (!author) {
    const err = new Error('No authors found');
    err.name = 'AuthorNotFoundError';
    return next(err);
  }
  next();
};
// TODO: give the error to the handler when available
const validateCategoryExsists = async (req, res, next) => {
  const {body} = req;
  if (body.categories === undefined) return next();

  const stringIds = body.categories.map((id) => id.toString());
  const isUnique = new Set(stringIds).size === body.categories.length;
  if (!isUnique) {
    const err = new Error('Categories must be unique');
    err.name = 'CategoryNotUnique';
    return next(err);
  }
  const categories = await Category.find({_id: {$in: body.categories}});
  if (categories.length !== body.categories.length) {
    const err = new Error('Category not found');
    err.name = 'CategoryNotFoundError';
    return next(err);
  }
  next();
};

module.exports = {
  validateCategoryExsists,
  validateAuthorExsists
};
