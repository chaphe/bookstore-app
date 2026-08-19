require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reviewsRouter = require('./routes/reviews');
const { swaggerJSDocs } = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', reviewsRouter);

swaggerJSDocs(app);

module.exports = app;