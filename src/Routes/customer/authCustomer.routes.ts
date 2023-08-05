import express from "express";


import productController from '../../Controllers/product.controller'


const router = express.Router();


router.post('/sell/:id', productController.sellProduct)


export default router;