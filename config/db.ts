import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 5000) => {
    let attempt = 0;

    while (attempt < retries) {
        try {
            await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase');
            console.log('MongoDB connected successfully');
            return
        } catch (error) {
            attempt++;
            console.error(`MongoDB connection attempt ${attempt} failed:`, error);

            if (attempt < retries) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay)); 
            } else {
                console.error('MongoDB connection failed after multiple attempts. Exiting...');
            }
        }
    }
};

export default connectDB;
