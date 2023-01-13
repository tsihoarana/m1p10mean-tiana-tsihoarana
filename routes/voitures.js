const auth = require("../middleware/auth");
const client = require("../middleware/client");
const _ = require("lodash");
const { Voiture, validate } = require("../models/voiture");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/depot", [auth, client], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let voiture = await Voiture.findOne({ numero: req.body.numero });
  if (voiture) return res.status(400).send("voiture déja enregistrer");

  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  voiture = new Voiture({ user: user._id , numero: req.body.numero });
  await voiture.save();

  res.send(_.pick(voiture, ["_id", "numero"]));
});

module.exports = router;