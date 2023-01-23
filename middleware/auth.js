const jwt = require("jsonwebtoken");
const config = require("config");
const CustomResponse = require("../models/customResponse");

module.exports = function(req, res, next) {
  // if (!config.get("requiresAuth")) return next();
  let customResponse = {};

  const token = req.header("x-auth-token");
  if (!token) {
    customResponse = new CustomResponse(401, 'Access denied. No token provided.');
    return res.status(401).send(customResponse);
  }

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (ex) {
    customResponse = new CustomResponse(400, 'Invalid token.');
    res.status(400).send(customResponse);
  }
};
