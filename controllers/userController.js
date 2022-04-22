const jwt = require("jwt");
const bcrypt = require("bcrypt");
const AppErr = require("./errorController");
const { APP_KEY } = require("../config/Constants");
const { validationResult } = require("express-validator");

const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 422;
    err.data = errors.array();
    next(err);
    return;
  }

  let { email, password, firstName, lastName } = req.body;

  bcrypt
    .hash(password, 123)
    .then((hashedPass) => {
      const user = new User({
        email,
        password: hashedPass,
        firstName,
        lastName,
        address: null,
        phone: null,
        latitude: null,
        longitude: null,
        userCart: [],
        userOrders: [],
      });

      return user.save();
    })
    .then((user) => {
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
        },
        APP_KEY,
        { expiresIn: "90d" }
      );
      res.status(200).json(token);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.logIn = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation Error");
    err.status = 422;
    err.data = errors.array();
    throw err;
  }

  let { email, password } = req.body;
  let logInUser = null;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const err = new Error("User Does not exist with the provided email ID");
        err.statusCode = 401;
        throw err;
      }
      logInUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((result) => {
      if (!result) {
        const err = new Error("Password doesnot match!");
        err.statusCode = 401;
        throw err;
      }

      const token = jwt.sign(
        {
          userId: logInUser._id.toString(),
          email: logInUser.email,
        },
        APP_KEY,
        { expiresIn: "90d" }
      );
      res.status(200).json(token);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
