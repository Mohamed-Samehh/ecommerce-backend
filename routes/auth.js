const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {userRegisterSchema, userLoginSchema, userUpdateSchema} = require('../utils/validations');

router.post('/register', validateRequest(userRegisterSchema), authController.register);
router.post('/login', validateRequest(userLoginSchema), authController.login);
router.get('/me', auth, authController.getMe);
router.put('/me', auth, validateRequest(userUpdateSchema), authController.updateMe);

module.exports = router;
