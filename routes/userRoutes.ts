import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { isValidPassword } from '../utils/isValidPassword';
import { emailRegex } from '../utils/emailRegex';
import authMiddleware from '../middlewares/authMiddleware';
import dotenv from 'dotenv'
dotenv.config()

const router = Router();
console.log(process.env.ACCESS_TOKEN_SECRET ,'hey')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET  || 'secretAccess'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secretRefresh'

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
 
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required'
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email already exists'
            });
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
        if(error instanceof Error){
        res.status(500).json({
            message: error.message
        });
    }
    res.status(500).json({
        message: error
    });
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
       // @ts-ignore
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
       // @ts-ignore
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        if(error instanceof Error){

            res.status(500).json({ message: error.message });
        }
        res.status(500).json({ message: error });
    }
});

// User login
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
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
        res.status(500).json({
            message: error
        });
    }
});

// Refresh access token
router.post('/refresh-token', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: 'Refresh token is required'
            });
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
        const userId = decoded.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        const newAccessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        if(error instanceof Error){
        res.status(500).json({
            message: error.message
        });
    }
    res.status(500).json({
        message: error
    });
    }

});

export default router;
