import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import getWeather_Controller from '../controllers/getWeather_Controller';

dotenv.config();

const router = Router();

// In-memory cache


router.get('/',getWeather_Controller );

export default router;
