const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/User");
const userController = require("../controllers/userController");
const { body } = require("express-validator");
const auth = require("../middlewares/userAuth");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email Id.")
      .custom((value, req) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already Exist");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Your password should have to at least 6 Character long"),
  ],
  userController.signUp
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email ID")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Please Enter a Valid Password!"),
  ],
  userController.onLogin
);

router.put("/cart/:id/:quantity", auth, userController.updateCart);

router.post("/cart/:id", auth, userController.addToCart);
router.get("/cart", auth, userController.getCart);
router.get("/order", auth, userController.getOrder);
router.get("/order/:id", auth, userController.getSelectedOrder);

router.post("/add-order", auth, userController.addOrderToCart);
router.get("/profile", auth, userController.viewProfile);
router.post("/address", auth, userController.editAddress);

module.exports = router;
