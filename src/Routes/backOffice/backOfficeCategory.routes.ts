import express from "express";


import categoryController from '../../Controllers/category.controller'


const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.get('/search/:name', categoryController.searchByCategory);
router.delete('/:id', categoryController.deleteCategory);
router.patch('/:id', categoryController.updateCategory);


export default router;