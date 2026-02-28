const process = require('node:process');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const errorHandler = require('./utils/error-handler');
const logger = require('./utils/logger');
require('dotenv').config({path: './config/.env'});
const routes = require('./routes');
const {deleteFromCloudinary} = require('./utils/cloudinary-handler');

const app = express();

app.use(cors({origin: process.env.FRONTEND_URL || 'http://localhost:4200'}));
app.use(express.static('public'));
app.use(express.json());

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        logger.info('MongoDB Connected...');
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  await connectionPromise;
}

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(routes);

app.use((err, req, res, next) => {
  const handler = errorHandler.find((e) => e.match(err));
  if (req.public_id) {
    deleteFromCloudinary(req.public_id);
  }
  if (handler) {
    const {statusCode, ...body} = handler.handler(err);
    logger.error(err);

    return res.status(statusCode).json(body);
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      status: err.statusCode >= 500 ? 'error' : 'fail',
      message: err.message
    });
  }

  logger.error(err);
  res.status(500).json({status: 'error', message: 'Something went wrong'});
});
app.use((req, res) => {
  res.sendStatus(404);
});

if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 3000, () => {
        logger.info(`Server running on port ${process.env.PORT || 3000}`);
      });
    })
    .catch((err) => {
      logger.error({err}, 'Connection error');
      process.exit(1);
    });
}

module.exports = app;
