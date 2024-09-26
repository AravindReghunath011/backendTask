import express from 'express'
const app = express()
import connectDB from './config/db'
import productRouter from './routes/productRoutes'
import inMemoryProductRouter from './routes/InMemoryProductRoutes'
import userRoutes from './routes/userRoutes'
import weatherRoutes from './routes/weatherRoutes'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'; // Import this to catch async errors
import logger from './utils/logger'; // Import the logger
import { AppError } from './utils/errors';
import  { Request, Response, NextFunction } from 'express';


connectDB()
app.use(express.json())
app.use('/api/v1/product',productRouter)
app.use('/api/v1/task1',inMemoryProductRouter)
app.use('/api/v1/task2/user',userRoutes)
app.use('/api/v1/task3/weather',weatherRoutes)

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
         next(err); 
    }

    if (err instanceof AppError) {
        logger.error(`${err.name}: ${err.message}`);
         res.status(err.statusCode).json({ message: err.message });
    }

    else if (err instanceof Error) {
        logger.error(`Internal Server Error: ${err.message}`);
         res.status(500).json({ message: 'Internal Server Error' });
    } else {
        logger.error('Unknown error occurred');
         res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(3000,()=>{
    console.log('App is listening at port 3000') 
})    