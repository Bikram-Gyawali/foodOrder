const express = require("express");
const router = express.Router();
const AppErr = require("../controllers/errorController");
const adminController = require("../controllers/adminController");

router.post("/addRestaurant", adminController.addRestaurant);

router.post("/addFood/:id", adminController.addFood);
router.get("/listRestaurants", adminController.listAllRestaurant);

router.use(AppErr.onInvalidEndpoint);

module.exports = router;
