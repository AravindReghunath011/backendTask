import { NextFunction, Request, Response } from "express";
import Product from "../models/productModel";
import { ValidationError } from "../utils/errors"; 

const createNewProduct_Controller = async (req: Request, res: Response,next:NextFunction) => {
    try {
        const { name, unit, category } = req.body;
        console.log(name, unit, category, 'req.body');

        if (!name || !unit || !category) {
            throw new ValidationError('Please provide all fields'); 
        }

        const newProduct = await Product.create({ name, unit, category });
        console.log(newProduct, 'newww');

        res.json({
            message: 'Product created successfully',
            newProduct,
        });
    } catch (error) {
        console.error('Error in createNewProduct controller:', error);
        return next(error)
    }
};

export default createNewProduct_Controller;
