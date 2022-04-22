const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("morgan");
const path = require("path");
const compression = require("compression");
const { MONGO_URI } = require("./config/Constants");

const app = express();

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

app.use(helmet());
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
