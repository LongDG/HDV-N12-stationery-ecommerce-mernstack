const express = require('express');
const router = express.Router();
const {
  getAllInventories,
  getInventoryByProduct,
  createInventory,
  deleteInventory
} = require('../controllers/inventoryController');

router.route('/')
  .get(getAllInventories)
  .post(createInventory);

router.route('/product/:productId')
  .get(getInventoryByProduct);

router.route('/:id')
  .delete(deleteInventory);

module.exports = router;
