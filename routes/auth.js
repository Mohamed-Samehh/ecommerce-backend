const express = require('express');

const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {userRegisterSchema, userLoginSchema, userUpdateSchema, verifyOtpSchema} = require('../utils/validations');

router.post('/register', validateRequest(userRegisterSchema), authController.register);
router.post('/register/verify-otp', validateRequest(verifyOtpSchema), authController.verifyOtp);
router.post('/login', validateRequest(userLoginSchema), authController.login);
router.post('/login/verify-otp', validateRequest(verifyOtpSchema), authController.verifyLoginOtp);
router.get('/me', auth, authController.getMe);
router.put('/me', auth, validateRequest(userUpdateSchema), authController.updateMe);

module.exports = router;
