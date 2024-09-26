import { Request,Response } from "express"
import Product from "../models/productModel";


const deleteProductWithId_Controller = async(req:Request,res:Response)=>{
    try {
        const id = req.query.id
        console.log(id,'id')
        if(!id){
            throw new Error('Id is not provided')
        }
    
        const deletedproduct = await Product.findByIdAndDelete(id)

        res.status(200).json({
            message:'Product created successfully',
            deletedproduct
        })
    } catch (error) {
        console.log('error in updateproduct controller',error)
        res.status(500).json({
            message:'error in updateproduct controller',
            error:error
        })
    }
}

export default deleteProductWithId_Controller;