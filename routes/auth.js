const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const CustomResponse = require("../models/customResponse");
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  let customResponse = {};

  const { error } = validate(req.body); 
  if (error) {
    customResponse = new CustomResponse(400, error.details[0].message, {});
    return res.send(customResponse);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    customResponse = new CustomResponse(400, 'Email ou mot de passe invalide.', {});
    return res.send(customResponse);
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    customResponse = new CustomResponse(400, 'Email ou mot de passe invalide.', {});
    return res.send(customResponse);
  }

  const token = user.generateAuthToken();
  user = _.pick(user, ["_id", "name", "email", "code_type"]);
  customResponse = new CustomResponse(200, '', {token, user});

  res.send(customResponse);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 