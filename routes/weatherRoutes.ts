import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { createClient } from 'redis'; // Import the createClient method

dotenv.config();

const router = Router();
const redisClient = createClient(); 

const WEATHER_API = process.env.WEATHER_API as string;

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

const connectRedisClient = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

connectRedisClient()

router.get('/', async (req: Request, res: Response) => {
    try {
        const { city } = req.body

        if (!city || typeof city !== 'string') {
         res.status(400).json({ message: 'City parameter is required and must be a string' });
        }

        const data = await redisClient.get(city);

        if (data) {
            console.log(data ,'from redis')
            res.json(JSON.parse(data));
        } else {
            try {
                let api = `${WEATHER_API}${city}`
                console.log(api,'api')
                const response = await axios.get(api);

                console.log(response.data,'response data');

                const simplifiedData = {
                    location: {
                        name: response.data.location.name,
                        region: response.data.location.region,
                        country: response.data.location.country,
                    },
                    current: {
                        temperature: response.data.current.temp_c,
                        condition: response.data.current.condition.text,
                        wind: response.data.current.wind_kph,
                        humidity: response.data.current.humidity,
                        feelsLike: response.data.current.feelslike_c,
                        pressure: response.data.current.pressure_mb,
                    },
                };

                console.log(simplifiedData,'data') 
                await redisClient.setEx(city, 600, JSON.stringify(simplifiedData));

                res.json({
                    data:simplifiedData
                });
            } catch (error) {
                console.error('API fetch error:', error);
                return res.status(500).json({
                    message: 'Error fetching data from weather API',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;
