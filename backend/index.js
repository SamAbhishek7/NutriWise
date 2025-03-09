import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoute from './routes/authRoute.js';
import geminiRoutes from './routes/geminiRoutes.js';
const app = express();
dotenv.config();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true 
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use("/api/auth", authRoute);
app.use('/api/gemini', geminiRoutes); 
mongoose.connect(MONGO_URI).then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});