module.exports = function(req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden
  // if (!config.get("requiresAuth")) return next();
  console.log("ito" + req.user.code_type);
  if (req.user.codeType > 0) return res.status(403).send("Access denied.");

  next();
};