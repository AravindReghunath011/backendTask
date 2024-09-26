import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { isValidPassword } from '../utils/isValidPassword';
import { emailRegex } from '../utils/emailRegex';
import authMiddleware from '../middlewares/authMiddleware';
import { AppError } from '../utils/errors'; // Import your custom error class
import dotenv from 'dotenv';
import registerUser_Controller from '../controllers/registerUser_Controller';
import viewProfile_Controller from '../controllers/viewProfile_Controller';
import login_Controller from '../controllers/login_Controller';
import makeRefreshToken_Controller from '../controllers/makeRefreshToken_Controller';

dotenv.config();

const router = Router();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secretAccess';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secretRefresh';

// Register a new user
router.post('/register', registerUser_Controller)

// Get user profile
router.get('/profile', authMiddleware, viewProfile_Controller);

// User login
router.post('/login',login_Controller);

// Refresh access token
router.post('/refresh-token', makeRefreshToken_Controller);

export default router;
