const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public (không yêu cầu auth, nhận user_id từ body)
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    console.log('Request body:', req.body);
    console.log('req.user:', req.user);

    // Validate input
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp user_id'
      });
    }

    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập product_id và quantity'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    // Kiểm tra user có tồn tại
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Kiểm tra sản phẩm có tồn tại
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${product.stock} sản phẩm trong kho`
      });
    }

    // Tìm giỏ hàng của user
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      // Case A: Chưa có giỏ -> Tạo mới
      cart = await Cart.create({
        user_id,
        items: [{ product_id, quantity }]
      });
    } else {
      // Case B: Đã có giỏ
      const itemIndex = cart.items.findIndex(
        item => item.product_id.toString() === product_id
      );

      if (itemIndex > -1) {
        // Sản phẩm đã có trong giỏ -> Cộng dồn số lượng
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Sản phẩm mới -> Thêm vào giỏ
        cart.items.push({ product_id, quantity });
      }

      await cart.save();
    }

    // Populate để trả về thông tin sản phẩm và user
    const populatedCart = await Cart.findById(cart._id)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name price images discount_percent');

    res.status(200).json({
      success: true,
      message: 'Đã thêm vào giỏ hàng',
      data: populatedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart?user_id=xxx hoặc GET /api/cart (với header x-user-id)
// @access  Public
exports.getCart = async (req, res) => {
  try {
    // Lấy user_id từ query, header, hoặc token
    const user_id = req.query.user_id || req.headers['x-user-id'] || (req.user ? req.user._id : null);

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp user_id trong query (?user_id=xxx) hoặc header (x-user-id)'
      });
    }

    const cart = await Cart.findOne({ user_id })
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name price images discount_percent stock');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] }
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:product_id
// @access  Public
exports.updateCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { user_id, quantity } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp user_id'
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Sản phẩm không có trong giỏ hàng'
      });
    }

    // Kiểm tra tồn kho
    const product = await Product.findById(product_id);
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Chỉ còn ${product.stock} sản phẩm trong kho`
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name price images discount_percent');

    res.status(200).json({
      success: true,
      message: 'Đã cập nhật giỏ hàng',
      data: populatedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:product_id?user_id=xxx
// @access  Public
exports.removeCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp user_id trong query'
      });
    }

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    cart.items = cart.items.filter(
      item => item.product_id.toString() !== product_id
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id)
      .populate('user_id', 'name email phone')
      .populate('items.product_id', 'name price images discount_percent');

    res.status(200).json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      data: populatedCart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart?user_id=xxx
// @access  Public
exports.clearCart = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp user_id trong query'
      });
    }

    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giỏ hàng'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng',
      data: cart
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
