const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { category, category_id, supplier_id, search, minPrice, maxPrice, status, page = 1, limit } = req.query;
    
    // Build query
    const query = {};
    
    // Support both 'category' and 'category_id' parameters
    if (category || category_id) {
      query.category_id = category || category_id;
    }
    
    if (supplier_id) {
      query.supplier_id = supplier_id;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (status !== undefined) {
      query.status = status === 'true';
    }
    
    // Động thái limit: 
    // - Nếu có category hoặc search: trả về tất cả kết quả
    // - Nếu không có gì: trả về 50 sản phẩm mặc định
    // - Nếu có limit được chỉ định: dùng limit đó
    const hasFilter = category || category_id || search || supplier_id || minPrice || maxPrice || (status !== undefined);
    const actualLimit = limit ? Number(limit) : (hasFilter ? 1000 : 50);
    
    // Pagination
    const skip = (page - 1) * actualLimit;
    
    const products = await Product.find(query)
      .populate('category_id', 'name')
      .populate('supplier_id', 'name')
      .limit(actualLimit)
      .skip(skip)
      .sort({ created_at: -1 });
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / actualLimit),
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    // Check if it's a valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    const product = await Product.findById(req.params.id)
      .populate('category_id', 'name')
      .populate('supplier_id', 'name email phone');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const { name, sku, description, price, discount_percent, images, stock, category_id, supplier_id, status } = req.body;
    
    // Validate
    if (!name || !sku || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (name, sku, price, category_id)'
      });
    }
    
    // Kiểm tra SKU đã tồn tại
    const skuExists = await Product.findOne({ sku });
    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: 'Mã SKU đã tồn tại'
      });
    }
    
    // Kiểm tra category tồn tại
    const categoryExists = await Category.findById(category_id);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Danh mục không tồn tại'
      });
    }
    
    // Kiểm tra supplier nếu có
    if (supplier_id) {
      const supplierExists = await Supplier.findById(supplier_id);
      if (!supplierExists) {
        return res.status(404).json({
          success: false,
          message: 'Nhà cung cấp không tồn tại'
        });
      }
    }
    
    const product = await Product.create({
      name,
      sku,
      description,
      price,
      discount_percent: discount_percent || 0,
      images: images || [],
      stock: stock || 0,
      category_id,
      supplier_id,
      status: status !== undefined ? status : true
    });
    
    const populatedProduct = await Product.findById(product._id)
      .populate('category_id', 'name')
      .populate('supplier_id', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: populatedProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi tạo sản phẩm',
      error: error.message
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Kiểm tra sản phẩm tồn tại
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    // Kiểm tra SKU nếu thay đổi
    if (updateData.sku && updateData.sku !== product.sku) {
      const skuExists = await Product.findOne({ sku: updateData.sku });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          message: 'Mã SKU đã tồn tại'
        });
      }
    }
    
    // Kiểm tra category nếu có thay đổi
    if (updateData.category_id && updateData.category_id !== product.category_id.toString()) {
      const categoryExists = await Category.findById(updateData.category_id);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Danh mục không tồn tại'
        });
      }
    }
    
    // Kiểm tra supplier nếu có thay đổi
    if (updateData.supplier_id && updateData.supplier_id !== product.supplier_id?.toString()) {
      const supplierExists = await Supplier.findById(updateData.supplier_id);
      if (!supplierExists) {
        return res.status(404).json({
          success: false,
          message: 'Nhà cung cấp không tồn tại'
        });
      }
    }
    
    // Update
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category_id', 'name')
      .populate('supplier_id', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật sản phẩm thành công',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Lỗi cập nhật sản phẩm',
      error: error.message
    });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật số lượng tồn kho
// @route   PATCH /api/products/:id/stock
// @access  Private
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng tồn kho không hợp lệ'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    )
      .populate('category_id', 'name')
      .populate('supplier_id', 'name');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật tồn kho thành công',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm liên quan
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const { limit = 4 } = req.query;
    
    // Check if it's a valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    // Tìm sản phẩm hiện tại để lấy category_id
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Tìm sản phẩm cùng danh mục, trừ sản phẩm hiện tại
    const relatedProducts = await Product.find({
      category_id: currentProduct.category_id,
      _id: { $ne: req.params.id },
      $or: [{ status: true }, { status: 1 }]
    })
      .populate('category_id', 'name')
      .populate('supplier_id', 'name')
      .limit(Number(limit))
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm nổi bật
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    // Lấy sản phẩm có discount_percent > 0 hoặc stock cao
    const featuredProducts = await Product.find({
      $or: [{ status: true }, { status: 1 }],
      $and: [
        { $or: [{ discount_percent: { $gt: 0 } }, { stock: { $gte: 50 } }] }
      ]
    })
      .populate('category_id', 'name')
      .populate('supplier_id', 'name')
      .limit(Number(limit))
      .sort({ discount_percent: -1, stock: -1 });

    res.status(200).json({
      success: true,
      count: featuredProducts.length,
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm bán chạy
// @route   GET /api/products/best-seller
// @access  Public
exports.getBestSellerProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Lấy sản phẩm có stock thấp (giả sử bán chạy) hoặc có discount
    const bestSellerProducts = await Product.find({
      $or: [{ status: true }, { status: 1 }]
    })
      .populate('category_id', 'name')
      .populate('supplier_id', 'name')
      .limit(Number(limit))
      .sort({ stock: 1, discount_percent: -1 }); // Sắp xếp theo stock tăng dần (bán chạy hơn)

    res.status(200).json({
      success: true,
      count: bestSellerProducts.length,
      data: bestSellerProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Thống kê sản phẩm cho admin
// @route   GET /api/products/stats
// @access  Public
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });
    const outOfStockProducts = await Product.countDocuments({ stock: 0 });
    
    res.status(200).json({
      success: true,
      data: {
        count: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
