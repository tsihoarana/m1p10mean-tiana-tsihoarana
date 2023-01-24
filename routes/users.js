const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const validateObjectId = require("../middleware/validateObjectId");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const CustomResponse = require("../models/customResponse");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  let user = await User.findById(req.user._id).select("-password");
  user = _.pick(user, ["_id", "name", "email", "code_type"]);

  const customResponse = new CustomResponse(200, '', user);
  res.send(customResponse);
});

router.get("/atelier/infos/:id", [auth, atelier, validateObjectId], async (req, res) => {
  let user = await User.findById(req.params.id).select("-password");
  user = _.pick(user, ["_id", "name", "email", "code_type"]);

  const customResponse = new CustomResponse(200, '', user);
  res.send(customResponse);
});

router.post("/", async (req, res) => {
  let customResponse = {};

  const { error } = validate(req.body);
  if (error) {
    customResponse = new CustomResponse(400, error.details[0].message, {});
    return res.send(customResponse);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    customResponse = new CustomResponse(400, 'Client deja enregistrer.', {});
    return res.send(customResponse);
  }

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.code_type = 0;
  await user.save();

  const token = user.generateAuthToken();
  user = _.pick(user, ["_id", "name", "email", "code_type"]);

  customResponse = new CustomResponse(200, '', {token, user});
  res.send(customResponse);
});

module.exports = router;
