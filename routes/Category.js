const express = require('express');

const router = express.Router();
const {categoryController} = require('../controllers'); // TODO: Link from sameh

router.get('/', categoryController.display); // list all categories (anyone)
router.post('/', categoryController.add); // add category (admin)
router.delete('/:id', categoryController.remove); // delete cat. (admin)
router.patch('/:id', categoryController.update); // update cat. name (admin)
module.exports = router;
