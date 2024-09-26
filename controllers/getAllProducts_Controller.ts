import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { AppError } from "../utils/errors"; // Import your custom error class

const getAllProducts_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error in getAllProducts controller:', error);
        return next(new AppError('Failed to retrieve products', 500)); // Pass the error to the global error handler
    }
};

export default getAllProducts_Controller;
