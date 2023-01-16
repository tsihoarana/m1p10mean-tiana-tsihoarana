const auth = require("../middleware/auth");
const client = require("../middleware/client");
const _ = require("lodash");
const { Visite } = require("../models/visite");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/client", [auth, client], async (req, res) => {
  const visite = await Visite.findOne({ etat: { $ne: 2 } });

  res.send(visite);
});

module.exports = router;