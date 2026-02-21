const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const {protect, restrictTo} = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {orderSchema, statusSchema, paymentSchema} = require('../utils/validations');

router.use(protect);

router.post('/', validateRequest(orderSchema), orderController.placeOrder);

router.get('/my', orderController.getMyOrders);

router.get('/', restrictTo('admin'), orderController.getAllOrders);

router.patch('/:id/status', restrictTo('admin'), validateRequest(statusSchema), orderController.updateOrderStatus);

router.patch('/:id/payment', restrictTo('admin'), validateRequest(paymentSchema), orderController.updatePaymentStatus);

module.exports = router;
