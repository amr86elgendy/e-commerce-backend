import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import connectDb from './config/db.js';

// import packages
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

// import Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import userRoutes from './routes/user.js';
import reviewRoutes from './routes/review.js';
import orderRoutes from './routes/order.js';

// import custo Middlewares
import trim from './middlewares/trim.js';
import notFoundMiddleware from './middlewares/not-found.js';
import errorHandlerMiddleware from './middlewares/error-handler.js';

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
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(fileUpload()); // When you upload a file, the file will be accessible from req.files

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`));
