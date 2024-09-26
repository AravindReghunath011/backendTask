import { Request,Response } from "express"
import Product from "../models/productModel";


const updateProductWithId_Controller = async(req:Request,res:Response)=>{
    try {
        const id = req.query.id
        const {name,unit,category} = req.body
        console.log(id,'id')
        console.log(req.body,'body')
        if(!id){
            throw new Error('Id is not provided')
        }
        if(!name || !unit || !category){
            throw new Error('Please provide all fields')
        }

        const updatedProduct = await Product.findByIdAndUpdate(id,{name:name,unit,category},{new:true})

        res.status(200).json({
            message:'Product created successfully',
            updatedProduct
        })
    } catch (error) {
        console.log('error in updateproduct controller',error)
        res.status(500).json({
            message:'error in updateproduct controller',
            error:error
        })
    }
}

export default updateProductWithId_Controller;