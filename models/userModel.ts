import mongoose, {  Schema } from 'mongoose';
import {userInterface} from '../interface/userInterface'

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {   
        type: String,
        required: true                    
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, 
});

// Create the Product model
const User = mongoose.model<userInterface>('User', userSchema);

export default User;
