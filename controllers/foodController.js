const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const AppErr = require("./errorController");

const LIST_ITEMS = 10;

exports.listAvailableFoods = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalFoods;

  Food.find()
    .countDocuments()
    .then((numOfFoods) => {
      totalFoods = numOfFoods;
      return Food.find().skip((page - 1) * LIST_ITEMS);
    })
    .then((foods) => {
      return res.status(200).json(foods);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.listTopResturants = (req, res, next) => {
  Restaurant.find()
    .populate("foods")
    .then((result) => {
      res.status.json(result);
    })
    .catch((err) => {
      return AppErr.onError(
        res,
        "restaurant not found around your location" + err
      );
    });
};

exports.listAllFoodsFromResturant = (req, res, next) => {
  const restaurantId = req.params.id;
  Restaurant.findById(restaurantId)
    .populate("foods")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.listFoodDetails = (req, res, next) => {
  const foodId = req.params.id;

  Food.findById(foodId)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.getInThirtyMinutes = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalFoods;
  Food.find({ readyTime: { $lt: 31 } })
    .countDocuments()
    .then((numOfFoods) => {
      totalFoods = numOfFoods;
      return Food.find({ readyTime: { $lt: 31 } }).limit(LIST_ITEMS);
    })
    .then((foods) => {
      return res.status(200).json(foods);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};
