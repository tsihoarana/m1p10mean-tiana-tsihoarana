const auth = require("../middleware/auth");
const client = require("../middleware/client");
const atelier = require("../middleware/atelier");
const _ = require("lodash");
const { Visite } = require("../models/visite");
const { User } = require("../models/user");
const { Voiture } = require("../models/voiture");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
const express = require("express");
const router = express.Router();

router.get("/client/encours", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const visites = await Visite.find({ etat: { $ne: CustomConfig.VISITE_PAYE }, user: user._id });

  const customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.get("/client/voiture/:numero", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const voiture = await Voiture.findOne({ numero: req.params.numero });

  const visites = await Visite.find({ user: user._id, voiture: voiture._id });

  const customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.post("/atelier/voiture/:numero/create", [auth, atelier], async (req, res) => {
  let customResponse = {};

  const voiture = await Voiture.findOne({ numero: req.params.numero });
  if (!voiture) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero');
    return res.send(customResponse);
  }
  if (voiture.etat != CustomConfig.VOITURE_ETAT_ACCEPTER) {
    customResponse = new CustomResponse(400, 'voiture non valide');
    return res.send(customResponse);
  }

  req.body.user = voiture.user;
  req.body.voiture = voiture._id;
  req.body.etat = CustomConfig.VISITE_ENCOURS;

  const visite = new Visite(_.pick(req.body, 
    ["user", "voiture", "etat"]));
  await visite.save();

  customResponse = new CustomResponse(200, '', visite);
  res.send(customResponse);
});

module.exports = router;