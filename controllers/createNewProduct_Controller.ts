import { Request,Response } from "express"
import Product from "../models/productModel";


const createNewProduct_Controller = async(req:Request,res:Response)=>{
    try {
        const {name,unit,category} = req.body
        console.log(name,unit,category,'req.body')
        if(!name || !unit || !category){
            console.log('hey')
            throw new Error('Please provide all fields')
        }
        const newProduct = await Product.create({name:name,unit:unit,category:category})
        console.log(newProduct,'newww')
        res.json({
            message:'Product created successfully',
            newProduct
        })
    } catch (error) {
        console.log('error in getallproducts controller',error)
        res.json({ 
            message:'error in getallproducts controller',
            error:error
        })  
    }
}

export default createNewProduct_Controller;