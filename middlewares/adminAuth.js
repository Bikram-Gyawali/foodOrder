const jwt = require("jsonwebtoken");
const AppErr = require("../controllers/errorController");
const User = require("../models/User");
const { APP_KEY } = require("../config/Constants");

module.exports = (req, res, next) => {
  const { authorizaion } = req.headers;
  if (!authorizaion) {
    return AppErr.unAuthorized();
  }
  const token = authorizaion.replace("Bearer ", "");

  jwt.verify(token, APP_KEY, async (err, payload) => {
    if (err) {
      return AppErr.onError(res, "Authorization verification failed!");
    }
    const { userId } = payload;
    User.findById(userId)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => {
        AppErr.onError(res, "Authorization token is not valid");
      });
  });
};
