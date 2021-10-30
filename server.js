import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// import Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';

// Middlewares
import { trim } from './middlewares/index.js';

dotenv.config();
connectDb();

// init App
const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(trim);
app.use(cookieParser());
app.use(express.static('uploads'));

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
