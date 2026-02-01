const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Lấy tất cả nhật ký kho
exports.getAllInventories = async (req, res) => {
  try {
    const inventories = await Inventory.find()
      .populate('product_id', 'name sku')
      .sort('-created_at');
    
    // Lọc bỏ inventory có product đã bị xóa
    const validInventories = inventories.filter(inv => inv.product_id !== null);
    
    res.status(200).json({
      success: true,
      count: validInventories.length,
      data: validInventories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy nhật ký kho theo sản phẩm
exports.getInventoryByProduct = async (req, res) => {
  try {
    const inventories = await Inventory.find({ product_id: req.params.productId })
      .populate('product_id', 'name sku')
      .sort('-created_at');
    
    // Lọc bỏ inventory có product đã bị xóa
    const validInventories = inventories.filter(inv => inv.product_id !== null);
    
    res.status(200).json({
      success: true,
      count: validInventories.length,
      data: validInventories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tạo nhật ký nhập/xuất kho
exports.createInventory = async (req, res) => {
  try {
    const { product_id, type, change_qty, note } = req.body;
    
    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    // Tạo nhật ký
    const inventory = await Inventory.create({
      product_id,
      type,
      change_qty,
      note
    });
    
    // Cập nhật số lượng tồn kho
    let newStock;
    if (type === 'import') {
      newStock = product.stock + change_qty;
    } else if (type === 'export') {
      if (product.stock < change_qty) {
        return res.status(400).json({
          success: false,
          message: 'Số lượng tồn kho không đủ'
        });
      }
      newStock = product.stock - change_qty;
    }
    
    // Chỉ update trường stock, tránh validation lỗi với các trường khác
    await Product.findByIdAndUpdate(product_id, { stock: newStock });
    
    res.status(201).json({
      success: true,
      data: inventory,
      newStock: newStock
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa nhật ký kho
exports.deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findByIdAndDelete(req.params.id);
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhật ký kho'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa nhật ký kho thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
