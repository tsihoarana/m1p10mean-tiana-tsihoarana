const auth = require("../middleware/auth");
const client = require("../middleware/client");
const _ = require("lodash");
const { Visite } = require("../models/visite");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/client", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const visites = await Visite.find({ etat: { $ne: 2 }, user: user._id });

  res.send(visites);
});

module.exports = router;