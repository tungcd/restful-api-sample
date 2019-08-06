const express = require('express');
const route = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

route.get('/', ProductController.get_all_product);

route.post('/', upload.single('productImage'), ProductController.post_product);

route.get('/:productId', ProductController.get_product_by_id);

route.delete('/:productId', ProductController.delete_product);

route.patch('/:productId', ProductController.patch_product);

module.exports = route;