const {Authors} = require('../models/index');

const findAllAuthors = (req, res, next) => {
  // TODO: implement finding all the authors with pagenation , dont forget to implement the filters
  res.status(200).json('authors found');
};

const findAuthorById = (req, res, next) => {
  // TODO: implement finding author with certain id
  res.status(200).json('author found');
};

const createAuthor = async (req, res, next) => {
  // TODO: create author while checking for the auth and the admin privlages

  res.status(201).json('author created');
};

const updateAuthor = async (req, res, next) => {
  // TODO: update author while checking for the auth and the admin privlages

  res.status(200).json('author updated');
};

module.exports = {
  findAllAuthors,
  findAuthorById,
  createAuthor,
  updateAuthor

};
