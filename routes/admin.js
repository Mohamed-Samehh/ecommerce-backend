const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {
  adminCreateUserSchema,
  adminUpdateUserSchema
} = require('../utils/validations');

// All routes require authentication and admin role
router.use(auth, admin);

router.get('/', adminController.getUsers);
router.get('/:id', adminController.getUserById);
router.post('/', validateRequest(adminCreateUserSchema), adminController.createUser);
router.put('/:id', validateRequest(adminUpdateUserSchema), adminController.updateUser);
router.delete('/:id', adminController.deleteUser);

module.exports = router;
