exports.unAuthorized = (req, res, next) => {
  res.status(401).json("User not authorized to provide response");
};

exports.onError = (res, msg = "Something went wrong") => {
  res.json(`Error ${msg}`);
};

exports.onInvalidEndpoint = (res) => {
  res.json("Please use valid endpoint to access");
};
