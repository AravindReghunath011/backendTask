import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; 
import {AppError} from '../utils/errors'; 
import { emailRegex } from '../utils/emailRegex'; 
import {isValidPassword} from '../utils/isValidPassword'
import dotenv from 'dotenv'
dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const registerUser_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return next(new AppError('Name, email, and password are required', 400));
        }

        if (!isValidPassword(password)) {
            return next(new AppError('Password must be at least 8 characters long', 400));
        }

        if (!emailRegex.test(email)) {
            return next(new AppError('Invalid email format', 400));
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('Email already exists', 400));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const user = await User.create({ name, email, password: hashedPassword });

        // Generate tokens
        const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        // Respond with the newly created user and tokens
        res.status(201).json({
            newUser: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: {
                accessToken,
                refreshToken,
            }
        });

    } catch (error) {
        return next(error); // Pass error to global error handler
    }
};

export default registerUser_Controller;
