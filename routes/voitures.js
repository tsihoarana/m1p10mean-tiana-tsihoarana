const auth = require("../middleware/auth");
const client = require("../middleware/client");
const atelier = require("../middleware/atelier");
const _ = require("lodash");
const { Voiture, validate } = require("../models/voiture");
const { User } = require("../models/user");
const CustomResponse = require("../models/customResponse");
const express = require("express");
const router = express.Router();

router.get("/client", [auth, client], async (req, res) => {

  const voitures = await Voiture.find({ user: req.user._id });

  const customResponse = new CustomResponse(200, '', voitures);
  res.send(customResponse);
});

router.post("/client/enregistrer", [auth, client], async (req, res) => {
  let customResponse = {};
  
  const { error } = validate(req.body);
  if (error) {
    customResponse = new CustomResponse(400, error.details[0].message);
    return res.status(400).send(customResponse);
  }

  let voiture = await Voiture.findOne({ numero: req.body.numero });
  if (voiture) {
    customResponse = new CustomResponse(400, 'voiture déja enregistrer');
    return res.status(400).send(customResponse);
  }

  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  voiture = new Voiture({ user: user._id , numero: req.body.numero });
  voiture.image = Buffer.from(string.split(",")[1],"base64");
  await voiture.save();
  
  customResponse = new CustomResponse(200, '', voiture);
  res.send(customResponse);
});

router.post("/client/deposer", [auth, client], async (req, res) => {
  let customResponse = {};
  
  let voiture = await Voiture.findOne({ numero: req.body.numero });
  if (!voiture) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero demandé');
    return res.status(404).send(customResponse);
  }
  if (voiture.etat != 2) {
    customResponse = new CustomResponse(400, 'Demande non valide');
    return res.status(400).send(customResponse);
  }

  voiture.etat = 0;
  await voiture.save();

  customResponse = new CustomResponse(200, '', voiture);
  res.send(customResponse);
});

router.get("/atelier/demande", [auth, atelier], async (req, res) => {

  const voitures = await Voiture.find({ etat: 0 });

  const customResponse = new CustomResponse(200, '', voitures);
  res.send(customResponse);
});

module.exports = router;