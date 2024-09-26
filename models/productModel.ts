import mongoose, {  Schema } from 'mongoose';
import {productInterface} from '../interface/productInterface'

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {   
        type: String,
        required: true                    
    },
    unit: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true, 
});

// Create the Product model
const Product = mongoose.model<productInterface>('Product', productSchema);

export default Product;
