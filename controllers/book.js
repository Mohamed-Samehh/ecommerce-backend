const {Books} = require('../models/index');

const findAllBooks = (req, res, next) => {
  // TODO: implement finding all the books with pagenation , dont forget to implement the filters
  res.status(200).json('books found');
};

const findBookById = (req, res, next) => {
  // TODO: implement finding book with certain id
  res.status(200).json('book found');
};

const createBook = async (req, res, next) => {
  // TODO: create book while checking for the auth and the admin privlages

  res.status(201).json('book created');
};

const updateBook = async (req, res, next) => {
  // TODO: update book while checking for the auth and the admin privlages

  res.status(200).json('book updated');
};

const deleteBook = async (req, res, next) => {
  // TODO: delete book while checking for the auth and the admin privlages

  res.status(202).json('book deleted');
};
module.exports = {
  findAllBooks,
  findBookById,
  createBook,
  updateBook,
  deleteBook
};
