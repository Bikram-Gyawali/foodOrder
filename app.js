const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const compression = require("compression");
const connectDB = require("./config/runDb");
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();


app.use(helmet());
app.use(compression());

connectDB;

app.use(express.json());

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const data = err.data;
  res.status(status).json({ data: data });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is up and running");
});
