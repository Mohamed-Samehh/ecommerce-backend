const express = require('express');

const router = express.Router();
const {orderController} = require('../controllers');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {orderSchema, statusSchema, paymentSchema} = require('../utils/validations');

router.post('/', auth, validateRequest(orderSchema), orderController.placeOrder);
router.get('/my', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);

router.get('/', auth, admin, orderController.getAllOrders);

router.patch('/:id/status', auth, admin, validateRequest(statusSchema), orderController.updateOrderStatus);

router.patch('/:id/payment', auth, admin, validateRequest(paymentSchema), orderController.updatePaymentStatus);

module.exports = router;
