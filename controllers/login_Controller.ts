import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; // Adjust the import path as needed
import {AppError} from '../utils/errors'; // Adjust the import path as needed
import dotenv from 'dotenv'
dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

console.log(ACCESS_TOKEN_SECRET,'access')

const login_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return next(new AppError('Email and password are required', 400));
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log(user,'user')
        if (!user) {
            return next(new AppError('Invalid email or password', 401)); // Changed to 401 for authentication errors
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401)); // Changed to 401 for authentication errors
        }

        // Generate tokens
        const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Respond with success
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            tokens: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return next(error); // Pass error to global error handler
    }
};

export default login_Controller;
