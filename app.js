const express = require("express");
const path = require("path");

const compression = require("compression");
const connectDB = require("./config/runDb");
const helmet = require("helmet");
const userRoutes=require("./routes/userRoutes");
const foodRoutes=require("./routes/foodRoutes");
const adminRoutes=require("./routes/adminRoutes");


const app = express();

connectDB;

app.use(helmet());
app.use(compression());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());
app.use("/user", userRoutes);
app.use("food", foodRoutes);
app.use("/admin", adminRoutes);
app.use(AppErr.unAuthorized);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const data = err.data;
  res.status(status).json({ data: data });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is up and running");
});
