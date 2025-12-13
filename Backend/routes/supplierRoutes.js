const express = require('express');
const router = express.Router();
const {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require('../controllers/supplierController');

router.route('/')
  .get(getAllSuppliers)
  .post(createSupplier);

router.route('/:id')
  .get(getSupplierById)
  .put(updateSupplier)
  .delete(deleteSupplier);

module.exports = router;
