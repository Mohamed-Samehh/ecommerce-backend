const process = require('node:process');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./helpers/errorHandler');
require('dotenv').config({path: './config/.env'});
const routes = require('./routes');

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:4200'}));
app.use(express.json());
app.use(routes);

app.use((err, req, res, next) => {
  const handler = errorHandler.find((e) => e.match(err));
  if (handler) {
    const {statusCode, ...body} = handler.handler(err);
    return res.status(statusCode).json(body);
  }
  res.status(500).json({status: 'error', message: 'Something went wrong'});
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

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}
connectDB();