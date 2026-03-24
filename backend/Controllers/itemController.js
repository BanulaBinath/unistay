const fs = require('fs');
const path = require('path');
const Item = require('../models/Item');

const isValidItemName = (value) => /^[A-Za-z\s]+$/.test(value);
const isValidDescription = (value) => /^[A-Za-z\s.,!?]+$/.test(value);

const removeUploadedFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const addItem = async (req, res) => {
  try {
    const { itemName, description, price, category } = req.body;
    const uploadedFile = req.file;

    if (!itemName || !itemName.trim()) {
      return res.status(400).json({ success: false, message: 'Item Name is required' });
    }

    if (!isValidItemName(itemName.trim())) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Item Name can only contain letters and spaces' });
    }

    if (!uploadedFile) {
      return res.status(400).json({ success: false, message: 'Item Image is required' });
    }

    if (!description || !description.trim()) {
      removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    if (!isValidDescription(description.trim())) {
      removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Description can only contain letters and basic punctuation' });
    }

    const parsedPrice = Number(price);
    if (!price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Price must be a valid number greater than 0' });
    }

    if (!category || !['active', 'inactive'].includes(category)) {
      removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Category must be either active or inactive' });
    }

    const item = await Item.create({
      itemName: itemName.trim(),
      itemImage: `/uploads/${uploadedFile.filename}`,
      description: description.trim(),
      price: parsedPrice,
      category
    });

    return res.status(201).json({
      success: true,
      message: 'Item added successfully',
      data: item
    });
  } catch (error) {
    if (req.file) {
      removeUploadedFile(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to add item',
      error: error.message
    });
  }
};

const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch items',
      error: error.message
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch item',
      error: error.message
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, description, price, category } = req.body;
    const uploadedFile = req.file;

    if (!itemName || !itemName.trim()) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Item Name is required' });
    }

    if (!isValidItemName(itemName.trim())) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Item Name can only contain letters and spaces' });
    }

    if (!description || !description.trim()) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    if (!isValidDescription(description.trim())) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Description can only contain letters and basic punctuation' });
    }

    const parsedPrice = Number(price);
    if (!price || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Price must be a valid number greater than 0' });
    }

    if (!category || !['active', 'inactive'].includes(category)) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(400).json({ success: false, message: 'Category must be either active or inactive' });
    }

    const item = await Item.findById(id);

    if (!item) {
      if (uploadedFile) removeUploadedFile(uploadedFile.path);
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.itemName = itemName.trim();
    item.description = description.trim();
    item.price = parsedPrice;
    item.category = category;

    if (uploadedFile) {
      if (item.itemImage) {
        const relativeImagePath = item.itemImage.replace(/^\/+/, '');
        const absoluteImagePath = path.join(__dirname, '..', relativeImagePath);
        removeUploadedFile(absoluteImagePath);
      }

      item.itemImage = `/uploads/${uploadedFile.filename}`;
    }

    await item.save();

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update item',
      error: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.itemImage) {
      const relativeImagePath = item.itemImage.replace(/^\/+/, '');
      const absoluteImagePath = path.join(__dirname, '..', relativeImagePath);
      removeUploadedFile(absoluteImagePath);
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete item',
      error: error.message
    });
  }
};

module.exports = {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem
};
