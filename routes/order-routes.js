const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const validateRequest = require('../middleware/validate-request');
const {orderSchema, statusSchema, paymentSchema} = require('../utils/validations');

router.post('/', validateRequest(orderSchema), orderController.placeOrder);

router.get('/my', orderController.getMyOrders);

router.get('/', orderController.getAllOrders);

router.patch('/:id/status', validateRequest(statusSchema), orderController.updateOrderStatus);

router.patch('/:id/payment', validateRequest(paymentSchema), orderController.updatePaymentStatus);

module.exports = router;
