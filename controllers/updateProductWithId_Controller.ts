import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { AppError } from "../utils/errors"; // Import your custom error class

const updateProductWithId_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.query.id;
        const { name, unit, category } = req.body;

        console.log(id, 'id');
        console.log(req.body, 'body');

        if (!id) {
            throw new AppError('Id is not provided', 400); 
        }
        if (!name || !unit || !category) {
            throw new AppError('Please provide all fields', 400); 
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { name, unit, category }, { new: true });

        if (!updatedProduct) {
            throw new AppError('Product not found', 404); // Handle case where product is not found
        }

        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct,
        });
    } catch (error) {
        console.error('Error in updateProductWithId controller:', error);
        return next(error); // Pass the error to the global error handler
    }
};

export default updateProductWithId_Controller;
