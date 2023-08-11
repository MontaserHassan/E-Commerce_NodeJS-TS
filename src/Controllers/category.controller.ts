import { Request, Response, NextFunction } from 'express';

import Category from '../Models/category.model';
import { Product } from '../Models/product.model';
import CustomError from '../Utils/CustomError.util';


// ---------------------------------- create category ----------------------------------

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categoryName = req.body.name.trim();
        if (categoryName.length < 3) {
            throw new CustomError('category name is short', 400);
        }
        if (categoryName == '') {
            throw new CustomError('Invalid category name', 400);
        }
        const checkCategoryExist = await Category.findOne({ name: req.body.name });
        if (checkCategoryExist) {
            throw new CustomError('Category already exists', 400);
        }
        const category = await Category.create({ name: (req.body.name).toLowerCase() });
        if (category) {
            res.status(201).send(category)
        } else {
            throw new CustomError('internal server error', 500);
        };
    } catch (err: any) {
        next(err);
    }
};


// ---------------------------------- get all categories ----------------------------------


const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalCategories: any = await Category.countDocuments();
        const totalPages: number = Math.ceil(totalCategories / pageSize);
        if (page > totalPages) throw new CustomError("This page doesn't exist", 404);
        const categories = await Category.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        res.status(200).send({ page: page, pageSize: pageSize, categories: categories, totalCategories: totalCategories, totalPages: totalPages });
    } catch (err: any) {
        next(err);
    }
};


// ---------------------------------- get category by id ----------------------------------


const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.params.id)
        const category = await Category.findById(req.params.id);
        if (category) {
            res.status(200).send(category);
        } else {
            throw new CustomError('This Category Not Exists', 404);
        }
    } catch (err: any) {
        next(err);
    }
};


// ---------------------------------- delete category ----------------------------------


const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            throw new CustomError('This Category Not Exists', 404);
        }
        const productsCategory = await Product.findOne({ categoryId: req.params.id });
        if (productsCategory) {
            throw new CustomError("This Category has Products and doesn't delete it ", 400);
        } else {
            await Category.deleteOne({ _id: category._id });
            res.status(204).send({ message: "delete successful" });
        }
    } catch (err: any) {
        next(err);
    }
};


// ---------------------------------- update category ----------------------------------


const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            throw new CustomError('This Category Not Exists', 404);
        };
        if (req.body.name === "") throw new CustomError('wrong input', 400);
        const checkCategoryExist = await Category.findOne({ name: req.body.name });
        if (checkCategoryExist) {
            throw new CustomError('Category already exists and go to modify it', 400);
        }
        const updatedCategory = await Category.updateOne({ _id: category._id }, { name: req.body.name }, { new: true });
        res.status(200).send(updatedCategory);
    } catch (err: any) {
        next(err);
    };
};


// ---------------------------------- search by category ----------------------------------


const searchByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regexQuery = { name: { $regex: new RegExp(req.params.name, 'i') } };
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalCategories: number = await Category.countDocuments(regexQuery);
        let categories;
        if (req.query.sort === '1') {
            categories = await Category.find(regexQuery).sort({ createdAt: 1 }).skip(skip).limit(pageSize);
        } else {
            categories = await Category.find(regexQuery).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalCategories / pageSize);
        console.log(categories)
        if (categories) {
            res.status(200).send({ page: page, pageSize: pageSize, categories: categories, totalCategories: totalCategories, totalPages: totalPages });
        } else {
            throw new CustomError('No Categories Found', 404);
        }

    } catch (error) {
        next(error);
    };
};



export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
    updateCategory,
    searchByCategory
};