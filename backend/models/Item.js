const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  itemName: {
    type: String,
    required: [true, 'Item Name is required'],
    trim: true
  },
  itemImage: {
    type: String,
    required: [true, 'Item Image is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['active', 'inactive']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);
