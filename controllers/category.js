const {Book, Category} = require('../models');

async function create(req, res, next) { // Post /categories (admin)
  const {name} = req.body; // validated by Joi
  try {
    const category = await Category.create({name}); // save in memory (make instance) + save in DB
    res.status(201).send({status: 'success', data: category}); // status + status code to help in frontend && category to show full document
  } catch (error) {
    console.log('controller');
    next(error); // to error handler
  }
}

async function display(req, res, next) { // Get /categories (public)
  try {
    const category = await Category.find(); // show all data
    res.status(200).send({status: 'success', data: category}); // status + status code to help in frontend && category to show full document
  } catch (error) {
    next(error); // to error handler
  }
}

async function remove(req, res, next) { // Delete /categories/:id (admin)
  const {id} = req.params;
  try {
    const category = await Category.findById(id); // check if id is in db or no
    if (!category) return res.status(404).send({status: 'fail', message: 'Category not found'});

    const books = await Book.find({$and: [{categories: id}, {categories: {$size: 1}}]}); // check if there are books that contain 1 category (the one in need to delete)
    if (books.length > 0) return res.status(400).send({status: 'fail', message: `Cannot delete ${books.length} books only have ${category.name} category, reassign them first`});

    await Book.updateMany({categories: id}, {$pull: {categories: id}}); // update books by removing the objectID (books having mult. categories not just desierd one)

    await Category.findByIdAndDelete(id); // hard delete the category
    res.status(200).send({status: 'success', message: `${category.name} Category deleted Successfully`});
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) { // Pathc /categories/:id (admin)
  const {id} = req.params;
  const {name} = req.body; // validated by Joi
  try {
    const category = await Category.findByIdAndUpdate( // if id not found (but valid objectid) return null (not error)==> need handlation,,, if not valid objectid => db throw error
      id,
      {name},
      {returnDocument: 'after', runValidators: true} // replace new:true with {returnDocument: 'after'} bec new is deprecated (ret new cat.), runvalidator to check new cat. follow schema
    );
    if (!category) return res.status(404).send({status: 'fail', message: 'Category not found'}); // if the id is valid(real objectid) but not in db

    res.status(200).send({status: 'success', data: category});
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  display,
  update,
  remove
};
