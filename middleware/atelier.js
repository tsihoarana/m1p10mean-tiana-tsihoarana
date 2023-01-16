module.exports = function(req, res, next) {
    // 401 Unauthorized
    // 403 Forbidden
    // if (!config.get("requiresAuth")) return next();
  
    if (req.user.code_type !== 1) return res.status(403).send("Access denied.");
  
    next();
  };