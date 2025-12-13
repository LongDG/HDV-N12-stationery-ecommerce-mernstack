const Supplier = require('../models/Supplier');

// Lấy tất cả nhà cung cấp
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({
      success: true,
      count: suppliers.length,
      data: suppliers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy nhà cung cấp theo ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Tạo nhà cung cấp mới
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật nhà cung cấp
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.status(200).json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa nhà cung cấp
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhà cung cấp'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Đã xóa nhà cung cấp thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
