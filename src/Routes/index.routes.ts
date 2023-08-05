import express from 'express';
import { Request, Response, NextFunction } from 'express';

import customerRoutes from './customer/customer.routes';
import backOfficeRoutes from './backOffice/backOffice.routes';
import errorHandler from "../Middlewares/errorHandler.middleware";
import productController from '../Controllers/product.controller';


const router = express.Router();


router.use('/', customerRoutes);
router.use('/backOffice', backOfficeRoutes);
router.get('/search', productController.searchGeneralOnProduct)
router.use((err: Error, req: Request, res: Response, next: NextFunction) => errorHandler(err, req, res, next));


export default router;