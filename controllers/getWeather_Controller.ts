import { Request, Response } from 'express';
import axios from 'axios';
import {AppError} from '../utils/errors'; // Adjust the import path as needed

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const WEATHER_API = process.env.WEATHER_API as string; // Ensure this is defined somewhere

// In-memory cache
const cache: { [key: string]: { data: any; expiry: number } } = {};

const getWeather_Controller = async (req: Request, res: Response) => {
    try {
        const { city } = req.body;

        // Validate city input
        if (!city || typeof city !== 'string') {
            return res.status(400).json({ message: 'City parameter is required and must be a string' });
        }

        // Check cache for existing data
        const cachedData = cache[city];
        const currentTime = Date.now();

        if (cachedData && cachedData.expiry > currentTime) {
            console.log(cachedData.data, 'from in-memory cache');
            return res.json(cachedData.data);
        }

        // Fetch weather data from API
        try {
            const api = `${WEATHER_API}${city}`;
            console.log(api, 'api');
            const response = await axios.get(api);

            console.log(response.data, 'response data');

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

            console.log(simplifiedData, 'data');

            // Store fetched data in cache with expiry time
            cache[city] = {
                data: simplifiedData,
                expiry: currentTime + CACHE_DURATION,
            };

            return res.json({ data: simplifiedData });
        } catch (error) {
            console.error('API fetch error:', error);
            return res.status(500).json({
                message: 'Error fetching data from weather API',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

export default getWeather_Controller;
