const CustomResponse = require("../models/customResponse");
const winston = require('winston');

module.exports = function(err, req, res, next){
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug 
  // silly
  const customResponse = new CustomResponse(500, 'Something failed.');
  res.send(customResponse);
}