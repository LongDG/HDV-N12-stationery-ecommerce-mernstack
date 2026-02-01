const Category = require('../models/Category');

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy danh mục theo ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Tạo danh mục mới
// @route   POST /api/categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập tên danh mục'
      });
    }
    
    // Kiểm tra danh mục đã tồn tại
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Danh mục đã tồn tại'
      });
    }
    
    const category = await Category.create({ name, description });
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật danh mục
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Kiểm tra tên danh mục trùng (nếu thay đổi tên)
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ name });
      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Tên danh mục đã tồn tại'
        });
      }
    }
    
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật danh mục thành công',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Xóa danh mục
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    // Kiểm tra xem danh mục có sản phẩm không
    const Product = require('../models/Product');
    const productsInCategory = await Product.countDocuments({ category: req.params.id });
    
    if (productsInCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục có ${productsInCategory} sản phẩm`
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
