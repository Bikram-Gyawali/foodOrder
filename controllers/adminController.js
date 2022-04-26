const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const AppErr = require("./errorController");

exports.addResturant = (req, res, next) => {
  const { name, foodType, pinCode, address, phone } = req.body;

  const restaurant = new Restaurant({
    name,
    foodType,
    pinCode,
    address,
    phone,
  });

  restaurant
    .save()
    .then((restaurant) => {
      return res.json(restaurant);
    })
    .catch((err) => {
      return AppErr.onError(res, "restaurant add error" + err);
    });
};

exports.addFood = (req, res, next) => {
  const restaurantId = req.params.id;
  const { name, description, category, price, readyTime } = req.body;

  let currentRestaurant;

  Restaurant.find(restaurantId)
    .then((restaurant) => {
      currentRestaurant = restaurant;
      let food = new Food({
        name,
        description,
        category,
        rating: 0,
        price,
        images: [],
        readyTime,
      });

      return food.save();
    })
    .then((food) => {
      currentRestaurant.foods.push(food);
      return currentRestaurant.save();
    })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((err) => {
      err.statusCode = 503;
      next(err);
    });
};

exports.listAllRestaurant = (req, res, next) => {
  Restaurant.find()
    .then((restaurants) => {
      res.status(200).json(restaurants);
    })
    .catch((err) => {
      return AppErr.onError(res, "restaurant add error" + err);
    });
};
