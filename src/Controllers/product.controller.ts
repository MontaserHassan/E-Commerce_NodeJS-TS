import { Request, Response, NextFunction } from 'express';

import Product from '../Models/products.model';
import Category from '../Models/categories.model';
import CustomError from '../Utils/CustomError.util';


const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkCategoryExist = await Category.findById(req.body.categoryId);
        if (!checkCategoryExist) {
            throw new CustomError("This Category doesn't exist", 404)
        }
        const productName = req.body.name.trim();
        if (productName.length < 3) {
            throw new CustomError('Product name is short', 400);
        }
        if (productName == '') {
            throw new CustomError('Invalid product name', 400);
        }
        const checkProductExist = await Product.findOne({ name: req.body.name });
        if (checkProductExist) {
            throw new CustomError('Product already exists, You can edit on it', 400);
        }
        const product = await Product.create({
            name: (req.body.name).toLowerCase(),
            categoryId: req.body.categoryId,
            description: (req.body.description).toLowerCase(),
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            color: (req.body.color).toLowerCase(),
        });
        if (product) {
            res.status(201).send(product)
        } else {
            throw new CustomError('internal server error', 500);
        };
    } catch (err: any) {
        next(err);
    };
};

const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: any = await Product.countDocuments();
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        if (page > totalPages) throw new CustomError("This page doesn't exist", 404);
        const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        res.status(200).send({ page: page, pageSize: pageSize, products: products, totalProducts: totalProducts, totalPages: totalPages });
    } catch (err: any) {
        next(err);
    };
};

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Product.findById(req.params.id);
        if (category) {
            res.status(200).send(category);
        } else {
            throw new CustomError('This Product Not Exists', 404);
        };
    } catch (err: any) {
        next(err);
    };
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new CustomError('This product Not Exists', 404);
        };
        if (product.stock > 0) {
            throw new CustomError("This product has stock and can't delete it ", 400);
        } else {
            await Product.deleteOne({ _id: product._id });
            res.status(204).send({ message: "delete successful" });
        };
    } catch (err: any) {
        next(err);
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            throw new CustomError('This Product Not Exists', 404);
        };
        const checkProductExist = await Product.findOne({ name: req.body.name });
        if (checkProductExist) {
            throw new CustomError('Product name already exists and go to modify it', 400);
        };
        const fieldsToUpdate: string[] = [];
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) fieldsToUpdate.push(key)
        }
        if (fieldsToUpdate.length === 0) throw new CustomError('No fields to update', 400);
        if (fieldsToUpdate.includes('name') && req.body.name.trim() === "") throw new CustomError('Product name cannot be empty', 400);
        if (fieldsToUpdate.includes('price') && (req.body.price.trim() === "" && isNaN(Number(req.body.price)))) throw new CustomError('Price must be a valid number', 400);
        if (fieldsToUpdate.includes('description') && req.body.description.trim() === "") throw new CustomError('Product description cannot be empty', 400);
        if (fieldsToUpdate.includes('stock') && (req.body.stock.trim() === "" && isNaN(Number(req.body.stock)))) throw new CustomError('Stock must be a valid number', 400);
        if (fieldsToUpdate.includes('color') && req.body.color.trim() === "") throw new CustomError('Product color cannot be empty', 400);
        const updatedProduct = await Product.updateOne({ _id: product._id }, req.body, { returnOriginal: false });
        res.status(200).send(updatedProduct);
    } catch (error) {
        next(error);
    };
};

const searchByProductName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const regexQuery = { name: { $regex: new RegExp(req.params.name, 'i') } };
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: number = await Product.countDocuments(regexQuery);
        let products;
        if (req.query.sort === '1') {
            products = await Product.find(regexQuery).sort({ createdAt: 1 }).skip(skip).limit(pageSize);
        } else {
            products = await Product.find(regexQuery).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        if (products) {
            res.status(200).send({ page: page, totalPages: totalPages, pageSize: pageSize, totalProducts: totalProducts, products: products });
        } else {
            throw new CustomError('No Products Found', 404);
        };
    } catch (error) {
        next(error);
    };
};

const searchGeneralOnProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchTerm: string = req.query.searchTerm as string;
        const regexQuery = {
            $or: [
                { name: { $regex: new RegExp(searchTerm, 'i') } },
                { description: { $regex: new RegExp(searchTerm, 'i') } },
                { color: { $regex: new RegExp(searchTerm, 'i') } },
            ]
        };
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: number = await Product.countDocuments(regexQuery);
        let products;
        if (req.query.sort === '1') {
            products = await Product.find(regexQuery).sort({ createdAt: 1 }).skip(skip).limit(pageSize);
        } else {
            products = await Product.find(regexQuery).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        res.status(200).send({ page: page, totalPages: totalPages, pageSize: pageSize, totalProducts: totalProducts, products: products });
    } catch (error) {
        next(error);
    };
};

const filterProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) throw new CustomError('Category not found', 404);
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: number = await Product.countDocuments({ categoryId: category._id });
        let products;
        if (req.query.sort === '1') {
            products = await Product.find({ categoryId: category._id }).sort({ createdAt: 1 }).skip(skip).limit(pageSize);
        } else {
            products = await Product.find({ categoryId: category._id }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        if (products) {
            res.status(200).send({ page: page, totalPages: totalPages, pageSize: pageSize, totalProducts: totalProducts, products: products });
        } else {
            throw new CustomError('No Categories Found', 404);
        };
    } catch (error) {
        next(error);
    };
};

const filterProductsByColor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: number = await Product.countDocuments({ color: req.params.color });
        let products;
        if (req.query.sort === '1') {
            products = await Product.find({ color: req.params.color }).sort({ createdAt: 1 }).skip(skip).limit(pageSize);
        } else {
            products = await Product.find({ color: req.params.color }).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        if (products) {
            res.status(200).send({ page: page, totalPages: totalPages, pageSize: pageSize, totalProducts: totalProducts, products: products });
        } else {
            throw new CustomError('No Products Found', 404);
        };
    } catch (error) {
        next(error);
    }
};

const filterProductsByPrice = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fromPrice: number = parseInt(req.query.from as string);
        const toPrice: number = parseInt(req.query.to as string);
        if (isNaN(fromPrice) || isNaN(toPrice)) throw new CustomError('Invalid price range', 400);
        const pageSize: number = 8;
        let page: number = parseInt(req.query.pageNumber as string, 10) || 1;
        let skip: number = (page - 1) * pageSize;
        const totalProducts: number = await Product.countDocuments({ price: { $gte: fromPrice, $lte: toPrice } });
        let products;
        if (req.query.sort === '1') {
            products = await Product.find({ price: { $gte: fromPrice, $lte: toPrice } }).sort({ price: 1 }).skip(skip).limit(pageSize);
        } else {
            products = await Product.find({ price: { $gte: fromPrice, $lte: toPrice } }).sort({ price: -1 }).skip(skip).limit(pageSize);
        };
        const totalPages: number = Math.ceil(totalProducts / pageSize);
        if (products) {
            res.status(200).send({ page: page, totalPages: totalPages, pageSize: pageSize, totalProducts: totalProducts, products: products });
        } else {
            throw new CustomError('No Categories Found', 404);
        };
    } catch (error) {
        next(error);
    }
};

const sellProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) throw new CustomError('Product not found', 404);
        if (req.body.stock <= 0) throw new CustomError('Product stock is not available now', 400);
        if (req.body.quantity === undefined || req.body.quantity <= 0) throw new CustomError('Quantity must be a positive number', 400);
        if (req.body.quantity > product.stock) throw new CustomError('Insufficient stock for the requested quantity', 400);
        product.stock -= req.body.quantity;
        await product.save();
        res.status(200).send({ message: 'Product sold successfully', product });
    } catch (error) {
        next(error);
    };
};


export default {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    searchByProductName,
    searchGeneralOnProduct,
    filterProductsByCategory,
    filterProductsByColor,
    filterProductsByPrice,
    sellProduct,
}