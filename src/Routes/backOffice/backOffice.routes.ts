import express from 'express';


import backOfficeCategoryRoutes from './backOfficeCategory.routes';
import backOfficeProductRoutes from './backOfficeProduct.routes';


const router = express.Router();


router.use('/category', backOfficeCategoryRoutes);
router.use('/product', backOfficeProductRoutes);


export default router