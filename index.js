const process = require('node:process');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/.env'});

const orderRouter = require('./routes/order-routes');
const reviewRouter = require('./routes/review-routes');

const app = express();

app.use('/api/orders', orderRouter);
app.use('/api/reviews', reviewRouter);

app.use(express.json());

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Connection error:', err.message);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
