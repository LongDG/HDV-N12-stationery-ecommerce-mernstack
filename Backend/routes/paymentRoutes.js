const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentByOrder,
  getPaymentsByUser,
  createPayment,
  updatePaymentStatus,
  deletePayment
} = require('../controllers/paymentController');

router.route('/')
  .get(getAllPayments)
  .post(createPayment);

router.route('/order/:orderId')
  .get(getPaymentByOrder);

router.route('/user/:userId')
  .get(getPaymentsByUser);

router.route('/:id')
  .put(updatePaymentStatus)
  .delete(deletePayment);

module.exports = router;
