const auth = require("../middleware/auth");
const client = require("../middleware/client");
const atelier = require("../middleware/atelier");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Voiture, validate } = require("../models/voiture");
const { User } = require("../models/user");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
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
    return res.send(customResponse);
  }

  let voiture = await Voiture.findOne({ numero: req.body.numero });
  if (voiture) {
    customResponse = new CustomResponse(400, 'voiture déja enregistrer');
    return res.send(customResponse);
  }

  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  voiture = new Voiture({ user: user._id , numero: req.body.numero });
  // optional
  voiture.setImage(req.body.image);
  voiture.setMarque(req.body.marque);
  voiture.setModele(req.body.modele);
  
  await voiture.save();
  
  customResponse = new CustomResponse(200, '', voiture);
  res.send(customResponse);
});

router.post("/client/deposer", [auth, client], async (req, res) => {
  let customResponse = {};
  
  let voiture = await Voiture.findOne({ numero: req.body.numero });
  if (!voiture) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero demandé');
    return res.send(customResponse);
  }
  if (voiture.user != req.user._id) {
    customResponse = new CustomResponse(400, 'voiture non trouver, verifier le numero demandé');
    return res.send(customResponse);
  }
  if (voiture.etat != CustomConfig.VOITURE_ETAT_SORTIE) {
    customResponse = new CustomResponse(400, 'Demande non valide');
    return res.send(customResponse);
  }

  voiture.etat = CustomConfig.VOITURE_ETAT_DEMANDE;
  voiture.resetDateDepot();
  await voiture.save();

  customResponse = new CustomResponse(200, '', voiture);
  res.send(customResponse);
});

router.get("/atelier/demande", [auth, atelier], async (req, res) => {
  const voitures = await Voiture.find({ etat: CustomConfig.VOITURE_ETAT_DEMANDE });

  const customResponse = new CustomResponse(200, '', voitures);
  res.send(customResponse);
});

router.post("/atelier/demande/accepter/:id", [auth, atelier, validateObjectId], async (req, res) => {
  const voiture = await Voiture.findById(req.params.id);
  if (!voiture) {
    customResponse = new CustomResponse(404, 'Demande non trouver');
    return res.send(customResponse);
  }
  if (voiture.etat != CustomConfig.VOITURE_ETAT_DEMANDE) {
    customResponse = new CustomResponse(400, 'Demande non valide');
    return res.send(customResponse);
  }

  voiture.etat = CustomConfig.VOITURE_ETAT_ACCEPTER;
  await voiture.save();

  const customResponse = new CustomResponse(200, '', voiture);
  res.send(customResponse);
});

module.exports = router;