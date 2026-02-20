const express = require('express');
const {bookController} = require('../controllers');

const router = express.Router();

router.get('/', (res, req) => {
  const {limit} = req.query;
  const {skip} = req.query;
  const {status} = req.query;
  const books = bookController.findAllBooks(limit, skip, status);
  res.status(200).json([books]);
});
