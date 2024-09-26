import { Request,Response } from "express"
import Product from "../models/productModel";


const getAllProducts_Controller = async(req:Request,res:Response)=>{
    try {
        const products = await Product.find();
        res.json(products);
            
    } catch (error) {
        console.log('error in getallproducts controller',error)
        res.json({
            message:'error in getallproducts controller',
            error:error
        })  
    }
}
 
export default getAllProducts_Controller;