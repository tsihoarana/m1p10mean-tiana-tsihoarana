const auth = require("../middleware/auth");
const client = require("../middleware/client");
const atelier = require("../middleware/atelier");
const _ = require("lodash");
const { Visite } = require("../models/visite");
const { User } = require("../models/user");
const { Voiture } = require("../models/voiture");
const express = require("express");
const router = express.Router();

router.get("/client/encours", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const visites = await Visite.find({ etat: { $ne: 2 }, user: user._id });

  res.send(visites);
});

router.get("/client/voiture/:numero", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const voiture = await Voiture.findOne({ numero: req.params.numero });

  const visites = await Visite.find({ user: user._id, voiture: voiture._id });

  res.send(visites);
});

router.post("/atelier/voiture/:numero/create", [auth, atelier], async (req, res) => {
  const voiture = await Voiture.findOne({ numero: req.params.numero });
  if (!voiture) return res.status(404).send("voiture non trouver, verifier le numero");
  if (voiture.etat != 1) return res.status(400).send("voiture non valide");

  req.body.user = voiture.user;
  req.body.voiture = voiture._id;

  const visite = new Visite(_.pick(req.body, 
    ["user", "voiture", "etat", "date_debut"]));
  visite.etat = 0;
  await visite.save();

  res.send(visite);
});

router.get("/sum/:id", async (req, res) => {
  const visite = await Visite.findById(req.params.id);
  const sum = visite.isAllReparationFinished();
  console.log("sum="+ sum);
  res.send({sum});
});

module.exports = router;