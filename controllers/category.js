const asyncWrapper = require('../middleware/async-handler');
const {Book, Category} = require('../models');

const create = asyncWrapper(async (req, res) => { // Post /categories (admin)
  const {name} = req.body; // validated by Joi
  const category = await Category.create({name}); // save in memory (make instance) + save in DB
  res.status(201).send({status: 'success', data: category}); // status + status code to help in frontend && category to show full document
});

const display = asyncWrapper(async (req, res) => { // Get /categories (public)
  const category = await Category.find(); // show all data
  res.status(200).send({status: 'success', data: category}); // status + status code to help in frontend && category to show full document
});

const remove = asyncWrapper(async (req, res, next) => { // Delete /categories/:id (admin)
  const {id} = req.params;

  const category = await Category.findById(id); // check if id is in db or no
  if (!category) {
    const error = new Error('Category not found');
    error.name = 'CategoryNotFoundError';
    return next(error); // err. handler
  }

  const books = await Book.find({$and: [{categories: id}, {categories: {$size: 1}}]}); // check if there are books that contain 1 category (the one in need to delete),"neglect soft deleted books"
  if (books.length > 0) {
    const error = new Error(`Cannot delete: ${books.length} books only have ${category.name} category, reassign them first`);
    error.name = 'CategoryDeleteError';
    return next(error); // err. handler
  }

  await Book.updateMany({categories: id}, {$pull: {categories: id}}); // update books by removing the objectID (books having mult. categories not just desierd one)
  await Category.findByIdAndDelete(id); // hard delete the category
  res.status(200).send({status: 'success', message: `${category.name} Category deleted successfully`});
});

const update = asyncWrapper(async (req, res, next) => { // Patch /categories/:id (admin)
  const {id} = req.params;
  const {name} = req.body; // validated by Joi

  const category = await Category.findByIdAndUpdate( // if id not found (but valid objectid) return null (not error)==> need handlation,,, if not valid objectid => db throw error
    id,
    {name},
    {returnDocument: 'after', runValidators: true} // replace new:true with {returnDocument: 'after'} bec new is deprecated (ret new cat.), runvalidator to check new cat. follow schema
  );
  if (!category) {
    const error = new Error('Category not found');
    error.name = 'CategoryNotFoundError';
    return next(error); // err. handler
  }

  res.status(200).send({status: 'success', data: category});
});

module.exports = {
  create,
  display,
  update,
  remove
};
