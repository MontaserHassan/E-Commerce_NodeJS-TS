import express from "express";


import productController from '../../Controllers/product.controller'


const router = express.Router();


router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/search/:name', productController.searchByProductName);
router.get('/filter/category/:categoryId', productController.filterProductsByCategory);
router.get('/filter/color/:color', productController.filterProductsByColor);
router.get('/filter/price', productController.filterProductsByPrice);
router.delete('/:id', productController.deleteProduct);
router.patch('/:id', productController.updateProduct);


export default router;