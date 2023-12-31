import express from "express";

import { categoryController } from '../../Controllers/index.controller'


const router = express.Router();


router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/search/:name', categoryController.searchByCategory);



export default router;