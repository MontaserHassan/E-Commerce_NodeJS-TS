import express from 'express';

import authRoutes from './auth.routes';
import customerCategoryRoutes from './customerCategory.routes';
import customerProductRoutes from './customerProduct.routes';
import authCustomer from './authCustomer.routes';


const router = express.Router();


router.use('/auth', authRoutes)
router.use('/category', customerCategoryRoutes);
router.use('/product', customerProductRoutes);

// middleware
router.use('auth/product', authCustomer);



export default router;