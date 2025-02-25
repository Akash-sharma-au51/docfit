require('dotenv').config();
const mongoose = require('mongoose');
const MongoURI = process.env.MONGO_URI;

const connecttoDB = async () => {
    try {
        await mongoose.connect(MongoURI);
        console.log('MongoDB connected');
    } catch (error) {
        console.log('Error connecting to MongoDB', error);
    }
};

module.exports = connecttoDB;