import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { isValidPassword } from '../utils/isValidPassword';
import { emailRegex } from '../utils/emailRegex';
import authMiddleware from '../middlewares/authMiddleware';
import { AppError } from '../utils/errors'; // Import your custom error class
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secretAccess';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secretRefresh';

// Register a new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!isValidPassword(password)) {
            return next(new AppError('Password must be at least 8 characters long', 400));
        }

        if (!emailRegex.test(email)) {
            return next(new AppError('Invalid email format', 400));
        }

        if (!name || !email || !password) {
            return next(new AppError('Name, email, and password are required', 400));
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('Email already exists', 400));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });

        const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            newUser: user,
            token: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return next(error); // Pass error to global error handler
    }
});

// Get user profile
router.get('/profile', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        //@ts-ignore
        if (!req.user) {
            return next(new AppError('User not authenticated', 401));
        }
        //@ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.json(user);
    } catch (error) {
        return next(error); // Pass error to global error handler
    }
});

// User login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Email and password are required', 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('Invalid email or password', 400));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 400));
        }

        const accessToken = jwt.sign({ id: user._id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user._id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

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
});

// Refresh access token
router.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return next(new AppError('Refresh token is required', 401));
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        const newAccessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        return next(error); 
    }
});

export default router;
