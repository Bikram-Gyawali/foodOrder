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

exports.getCart = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("userCart.food")
    .then((user) => {
      res.status(200).json(user.userCart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addToCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;

  let currentUser;

  User.findById(userId)
    .populate("userCart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.addToCart(food);
    })
    .then((result) => {
      res.status(200).json(result.userCart);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateCart = (req, res, next) => {
  const userId = req.userId;
  const foodId = req.params.id;
  const quantity = req.params.quantity;

  let currentUser;
  User.findById(userId)
    .populate("userCart.food")
    .then((user) => {
      currentUser = user;
      return Food.findById(foodId);
    })
    .then((food) => {
      return currentUser.updateCart(food, quantity);
    })
    .then((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next();
    });
};

exports.getOrder = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .populate("userOrders")
    .then((user) => {
      res.status(200).json(user.userOrders);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getSelectedOrder = (req, res, next) => {
  const orderId = req.params.id;

  Order.findById(orderId)
    .populate("items")
    .then((order) => {
      res.status(200).json(order);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addOrderToCart = (req, res, next) => {
  const userId = req.userId;
  const orderId = `${Math.floor(Math.random() * 14244 + 1000)}`;
  let currentUser;
  let total = 0;
  User.findById(userId)
    .populate("userOrders")
    .populate("userCart.food")
    .then((user) => {
      currentUser = user;
      let orderedItems = [];
      user.userCart.map((item) => {
        let quantity = item.quantity;
        let price = item.food.price;
        total += quantity * price;
        orderedItems.push(item.food);
      });

      let order = new Order({
        orderId: orderId,
        items: orderedItems,
        totalAmount: total,
        orderDate: new Date(),
        paidThrough: "",
        paymentResponse: "",
        ordereStatus: "waiting",
      });
      return order.save();
    })
    .then((order) => {
      currentUser.userOrders.push(order);
      currentUser.userCart = [];
      return currentUser.save();
    })
    .then((result) => res.status(200).json(result.order))
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.viewProfile = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editAddress = (req, res, next) => {
  const userId = req.userId;
  const address = req.body.address;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const phone = req.body.phone;

  User.findById(userId)
    .select("-password")
    .then((user) => {
      user.address = address;
      user.phone = phone;
      user.latitude = latitude;
      user.longitude = longitude;
      return user.save();
    })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
