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
