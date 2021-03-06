const express = require("express");
const router = express.Router();
const err = require("../controllers/errorController");
const foodController = require("../controllers/foodController");

router.get("/getIn30min", foodController.getInThirtyMinutes);

router.get("/:id", foodController.listFoodDetails);

router.get("/top/restaurants", foodController.listTopResturants);

router.get("/restaurant/:id", foodController.listAllFoodsFromResturant);

router.get("/", foodController.listAvailableFoods);

router.use(err.onInvalidEndpoint);


module.exports=router;