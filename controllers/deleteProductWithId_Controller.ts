import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { ValidationError } from "../utils/errors"; 

const deleteProductWithId_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.query.id;
        console.log(id, 'id');

        if (!id) {
            throw new ValidationError('Id is not provided');
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            throw new ValidationError('Product not found');
        }

        res.status(200).json({
            message: 'Product deleted successfully',
            deletedProduct,
        });
    } catch (error) {
        console.error('Error in deleteProductWithId controller:', error);
        return next(error); // Pass the error to the global error handler
    }
};

export default deleteProductWithId_Controller;
