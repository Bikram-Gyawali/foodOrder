const express = require("express");
const router = express.Router();
const auth = require("../middlewares/adminAuth");
const AppErr = require("../controllers/errorController");
const adminController = require("../controllers/adminController");

router.post("/add-resturant", adminController.addResturant);

router.post("/addFood/:id", adminController.addFood);
router.get("/listRestaurants", adminController.listAllRestaurant);

router.use(AppErr.onInvalidEndpoint);

module.exports = router;
