const express = require('express');
const { uploadProduct, getAllProducts } = require('../controller/productController');

const router = express.Router();
router.post('/upload/:user_id', uploadProduct);
router.get('/getall', getAllProducts);

module.exports = router;
