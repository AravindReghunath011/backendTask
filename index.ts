import express from 'express'
const app = express()
import connectDB from './config/db'
import productRouter from './routes/productRoutes'
import inMemoryProductRouter from './routes/InMemoryProductRoutes'
import userRoutes from './routes/userRoutes'
import weatherRoutes from './routes/weatherRoutes'
import dotenv from 'dotenv'
dotenv.config()


connectDB()
app.use(express.json())
app.use('/api/v1/product',productRouter)
app.use('/api/v1/task1',inMemoryProductRouter)
app.use('/api/v1/task2/user',userRoutes)
app.use('/api/v1/task3/weather',weatherRoutes)


app.listen(3000,()=>{
    console.log('App is listening at port 3000')
})    