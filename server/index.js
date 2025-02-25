const express = require('express');
const cookieParser = require('cookie-parser');
const userRouter = require('./Routes/userRoutes');
const connecttoDB = require('./db.config');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

const corsOption = {
    origin: "http://localhost:3000", 
    credentials: true,
    optionSuccessStatus: 200
};

// Check for essential environment variables
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing in .env file');
    process.exit(1);
}

// Middlewares
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/User', userRouter);

// Database connection and server start
connecttoDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`App is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to the database', error);
    });
