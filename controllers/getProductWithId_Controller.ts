import { Request,Response } from "express"
import Product from "../models/productModel";


const getProductWithId_Controller = async(req:Request,res:Response)=>{
    try {
        const id = req.query.id
        if(!id){
            throw new Error("Id is not provided")
        }
        const product = await Product.findById(id);
        res.json(product);
            
    } catch (error) { 
        console.log('error in getproductwithid controller',error)
        res.json({
            message:'error in getproductwithId controller',
            error:error
        })  
    }
}
 
export default getProductWithId_Controller;