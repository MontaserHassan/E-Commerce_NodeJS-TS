import express from 'express';


import customerCategoryRoutes from './customerCategory.routes';
import customerProductRoutes from './customerProduct.routes';


const router = express.Router();


router.use('/category', customerCategoryRoutes);
router.use('/product', customerProductRoutes);


export default router;