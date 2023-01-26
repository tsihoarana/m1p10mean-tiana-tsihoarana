const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");

module.exports = function(req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden
    // if (!config.get("requiresAuth")) return next();
  
    if (req.user.code_type !== CustomConfig.USER_ATELIER) {
      const customResponse = new CustomResponse(403, 'Access denied.');
      return res.send(customResponse);
    }
  
    next();
  };