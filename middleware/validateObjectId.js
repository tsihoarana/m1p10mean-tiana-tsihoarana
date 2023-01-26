const CustomResponse = require("../models/customResponse");
const mongoose = require('mongoose');

module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    const customResponse = new CustomResponse(404, 'ID invalide.');
    return res.send(customResponse);
  }
  
  next();
}