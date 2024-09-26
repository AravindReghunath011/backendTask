import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel'; // Adjust the import path as needed
import {AppError} from '../utils/errors'; // Adjust the import path as needed

const viewProfile_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Ensure user is authenticated
        //@ts-ignore
        const userId = req.user?.id; // Optional chaining for safety
        if (!userId) {
            return next(new AppError('User not authenticated', 401));
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Respond with user information
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            // Add any other user fields you want to return
        });
    } catch (error) {
        return next(error); // Pass error to global error handler
    }
};

export default viewProfile_Controller;
