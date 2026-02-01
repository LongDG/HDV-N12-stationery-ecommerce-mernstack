const Contact = require('../models/Contact');

// @desc    Tạo tin nhắn liên hệ mới
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Gửi tin nhắn thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.',
      data: contact
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(400).json({
      success: false,
      message: 'Lỗi khi gửi tin nhắn',
      error: error.message
    });
  }
};

// @desc    Lấy tất cả tin nhắn liên hệ
// @route   GET /api/admin/contacts
// @access  Admin only
exports.getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (status && ['pending', 'replied', 'resolved'].includes(status)) {
      query.status = status;
    }

    // Get contacts with pagination
    const contacts = await Contact.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get stats
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: total,
      pending: 0,
      replied: 0,
      resolved: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: contacts,
      pagination: {
        currentPage: page,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: formattedStats
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Cập nhật trạng thái và phản hồi tin nhắn
// @route   PUT /api/admin/contacts/:id
// @access  Admin only
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_reply } = req.body;

    const updateData = {};
    
    if (status && ['pending', 'replied', 'resolved'].includes(status)) {
      updateData.status = status;
      if (status === 'replied') {
        updateData.replied_at = new Date();
      }
    }

    if (admin_reply) {
      updateData.admin_reply = admin_reply;
      updateData.status = 'replied';
      updateData.replied_at = new Date();
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin nhắn'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật tin nhắn thành công',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// @desc    Xóa tin nhắn liên hệ
// @route   DELETE /api/admin/contacts/:id
// @access  Admin only
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin nhắn'
      });
    }

    res.json({
      success: true,
      message: 'Xóa tin nhắn thành công'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};