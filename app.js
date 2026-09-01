import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import sellerRoutes from './routes/sellerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import cartRoutes from './routes/cartRoutes.js'; // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ ঠিক করে দেবেন

dotenv.config();   

const app = express();
const PORT = process.env.PORT || 5000;

// MONGO_URI আগে ডিক্লেয়ার করতে হবে
const MONGO_URI = process.env.MONGO_URI;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/sellers', sellerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/hero', heroRoutes);

// Basic Root Route
app.get('/', (req, res) => {
  res.send('MegaStore E-Commerce API is running...');
});

// Database Connection & Server Start
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });