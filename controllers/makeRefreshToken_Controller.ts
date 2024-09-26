import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; // Adjust the import path as needed
import {AppError} from '../utils/errors'; // Adjust the import path as needed
import dotenv from 'dotenv'
dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const makeRefreshToken_Controller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        // Validate input
        if (!refreshToken) {
            return next(new AppError('Refresh token is required', 401));
        }

        // Verify the refresh token
        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        } catch (err) {
            return next(new AppError('Invalid refresh token', 401)); // Handle invalid token
        }

        const userId = decoded.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        // Respond with the new access token
        res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        return next(error); // Pass error to global error handler
    }
};

export default makeRefreshToken_Controller;
