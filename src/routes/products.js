const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const productController = require('../controller/product')

//Create Data => POST : localhost:4000/v1/product/post 
router.post('/post',
  [
    body('title').isLength({ min: 3 }).withMessage("input tidak sesuai"),
    body('deskripsi').isLength({ min: 5 }).withMessage("input tidak sesuai")
  ],
  productController.createProduct)

//Get all data => GET : localhost:4000/v1/product/products 
router.get('/products', productController.getAllProducts)


module.exports = router