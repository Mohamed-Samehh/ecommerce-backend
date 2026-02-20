const process = require('node:process');
const dotenv = require('dotenv').config({path: './config/.env'});

const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use('/', routes);

app.get('/', (req, res) => {
  res.send('Ecommerce is running');
});

app.use('', (req, res) => res.send('404 wrong route'));

const initDBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to DB server');
    app.listen(3003, () => {
      console.log(`Server running on http://localhost:3003`);
    });
  } catch (error) {
    console.log(error);
  }
};

// console.log('mo');
initDBConnection();
module.exports = initDBConnection;
