const process = require('node:process');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({path: './config/.env'});

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:4200'}));
app.use((error, req, res, next) => {
  res.status(422).json({error: error.message});
});
app.use((req, res) => {
  res.sendStatus(404);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Up and running: http://127.0.0.1:${PORT}`);
});
connectDB();
