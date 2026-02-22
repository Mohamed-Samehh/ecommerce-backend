const express = require('express');
const isAdmin = require('../middleware/admin'); // then, check the req.user.roles
const auth = require('../middleware/auth'); // first set the req.user
const validateRequest = require('../middleware/validate-request');
const {categorySchema} = require('../utils/validations');

const router = express.Router();
const {categoryController} = require('../controllers');

router.get('/', categoryController.display); // list all categories (anyone)
router.post('/', auth, isAdmin, validateRequest(categorySchema), categoryController.create); // add category (admin)
router.delete('/:id', auth, isAdmin, categoryController.remove); // delete cat. (admin)
router.patch('/:id', auth, isAdmin, validateRequest(categorySchema), categoryController.update); // update cat. name (admin)
module.exports = router;

// req with no token => 401 error, else auth set req.user
// req with no admin token (check req.user.roles)=> 403 error, else to the Joi (validate req.body)

// Joi validation after auth to save time if the Joi is ok but, not auth. customer
