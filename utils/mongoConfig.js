const mongoose = require('mongoose');
require('dotenv').config();  
const connectMongoDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI;  
        if (!dbURI) {
            throw new Error('MONGO_URI environment variable is not defined');
        }
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectMongoDB;