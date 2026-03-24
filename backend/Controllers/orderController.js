const Item = require('../models/Item');
const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const {
      itemId,
      email,
      roomNumber,
      phone,
      quantity,
      orderDate,
      time,
      liveLocation,
      notes
    } = req.body;

    if (!itemId || !email || !roomNumber || !phone || !quantity || !orderDate || !time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order fields'
      });
    }

    const parsedQuantity = Number(quantity);
    if (Number.isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Selected item not found'
      });
    }

    if (!item.vendorId) {
      return res.status(400).json({
        success: false,
        message: 'This item is not assigned to a vendor'
      });
    }

    const unitPrice = Number(item.price);
    const totalPrice = unitPrice * parsedQuantity;

    const order = await Order.create({
      itemId: item._id,
      itemName: item.itemName,
      itemImage: item.itemImage,
      vendorId: item.vendorId,
      userId: req.user.userId,
      email: email.trim(),
      roomNumber: String(roomNumber).trim(),
      phone: String(phone).trim(),
      quantity: parsedQuantity,
      unitPrice,
      totalPrice,
      orderDate: String(orderDate).trim(),
      time: String(time).trim(),
      liveLocation: liveLocation ? String(liveLocation).trim() : '',
      notes: notes ? String(notes).trim() : '',
      status: 'Pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ vendorId: req.user.userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor orders',
      error: error.message
    });
  }
};

const updateVendorOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Accepted', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of Pending, Accepted, Completed, Cancelled'
      });
    }

    const order = await Order.findOne({ _id: id, vendorId: req.user.userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for this vendor'
      });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

const deleteVendorOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, vendorId: req.user.userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for this vendor'
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getVendorOrders,
  updateVendorOrderStatus,
  deleteVendorOrder
};
