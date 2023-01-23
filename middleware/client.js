const CustomResponse = require("../models/customResponse");

module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  // if (!config.get("requiresAuth")) return next();

  if (req.user.code_type !== 0) {
    const customResponse = new CustomResponse(403, 'Access denied.');
    return res.status(403).send(customResponse);
  }

  next();
};