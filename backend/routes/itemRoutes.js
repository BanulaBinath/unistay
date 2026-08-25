const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { verifyToken, isVendor } = require('../middleware/authMiddleware');
const { addItem, getItems, getItemById, updateItem, deleteItem } = require('../controllers/itemController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const handleUploadErrors = (req, res, next) => {
  upload.single('itemImage')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'Image size must be less than 5MB'
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return next();
  });
};

router.get('/', getItems);
router.get('/:id', getItemById);
router.put('/:id', verifyToken, isVendor, handleUploadErrors, updateItem);
router.delete('/:id', verifyToken, isVendor, deleteItem);

router.post('/add', verifyToken, isVendor, handleUploadErrors, addItem);

module.exports = router;
