import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { AppError } from "../utils/errors"; // Import your custom error class

const getProductWithId_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.query.id;
        
        if (!id) {
            throw new AppError("Id is not provided", 400); // Use custom error for missing ID
        }

        const product = await Product.findById(id);
        
        if (!product) {
            throw new AppError("Product not found", 404); // Handle case where product is not found
        }

        res.json(product);
    } catch (error) {
        console.error('Error in getProductWithId controller:', error);
        return next(error); // Pass the error to the global error handler
    }
};

export default getProductWithId_Controller;
