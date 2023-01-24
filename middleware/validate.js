const CustomResponse = require("../models/customResponse");

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);  
    if (error) {
      const customResponse = new CustomResponse(400, error.details[0].message);
      return res.send(customResponse);
    }
    next();
  }
}
