const auth = require("../middleware/auth");
const client = require("../middleware/client");
const atelier = require("../middleware/atelier");
const financier = require("../middleware/financier");
const _ = require("lodash");
const { Visite } = require("../models/visite");
const { User } = require("../models/user");
const { Voiture } = require("../models/voiture");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const { and } = require("joi/lib/types/object");
const router = express.Router();

router.get("/client/encours", [auth, client], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const visites = await Visite.find({ etat: { $ne: CustomConfig.VISITE_PAYE }, user: user._id });

  const customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.get("/client/voiture/:numero", [auth, client], async (req, res) => {
  let customResponse = {};

  const user = await User.findById(req.user._id).select("-password");
  req.body.user = user;

  const voiture = await Voiture.findOne({ numero: req.params.numero });
  if (!voiture) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero');
    return res.send(customResponse);
  }
  if (voiture.user != req.user._id) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero demandé');
    return res.send(customResponse);
  }
  const visites = await Visite
    .find({ user: user._id, voiture: voiture._id })
    .sort({ date_debut: -1 });;

  customResponse = new CustomResponse(200, '', visites);
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
  if (!await voiture.isVisiteFinished()) {
    customResponse = new CustomResponse(400, 'une visite encore non terminer');
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

router.get("/atelier/voiture/:numero", [auth, atelier], async (req, res) => {
  let customResponse = {};

  const voiture = await Voiture.findOne({ numero: req.params.numero });
  if (!voiture) {
    customResponse = new CustomResponse(404, 'voiture non trouver, verifier le numero');
    return res.send(customResponse);
  }

  const visites = await Visite.find({ voiture: voiture._id });

  customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.get("/atelier", [auth, atelier], async (req, res) => {
  const search_query = req.query.etat ? { etat: req.query.etat } : {};
  const visites = await Visite
    .find(search_query)
    .sort({ date_debut: -1 });

  const customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.get("/client", [auth, client], async (req, res) => {
  const search_query = req.query.etat ? { etat: req.query.etat, user: req.user._id } : { user: req.user._id };
  const visites = await Visite
    .find(search_query)
    .sort({ date_debut: -1 });

  const customResponse = new CustomResponse(200, '', visites);
  res.send(customResponse);
});

router.post("/atelier/terminer/:id", [auth, atelier, validateObjectId], async (req, res) => {
  let customResponse = {};

  const visite = await Visite.findById(req.params.id);
  if (!visite) {
    customResponse = new CustomResponse(404, 'visite non trouver');
    return res.send(customResponse);
  }
  if (!visite.isAllReparationFinished()) {
    customResponse = new CustomResponse(400, "Reparation du visite non terminé");
    return res.send(customResponse);
  }
  if (visite.etat != CustomConfig.VISITE_ENCOURS) {
    customResponse = new CustomResponse(400, "visite non valide");
    return res.send(customResponse);
  }

  visite.date_fin = req.body.date_fin || new Date();
  visite.etat = CustomConfig.VISITE_TERMINER_NON_PAYE;
  await visite.save();

  customResponse = new CustomResponse(200, '', visite);
  return res.send(customResponse);
});

router.get("/atelier/:id", [auth, atelier, validateObjectId], async (req, res) => {
  let customResponse = {};

  const visite = await Visite.findById( req.params.id );
  if (!visite) {
    customResponse = new CustomResponse(404, 'visite non trouver');
    return res.send(customResponse);
  }

  customResponse = new CustomResponse(200, '', visite);
  res.send(customResponse);
});

router.get("/financier/:id", [auth, financier, validateObjectId], async (req, res) => {
  let customResponse = {};

  const visite = await Visite.findById( req.params.id );
  if (!visite) {
    customResponse = new CustomResponse(404, 'visite non trouver');
    return res.send(customResponse);
  }

  customResponse = new CustomResponse(200, '', visite);
  res.send(customResponse);
});

router.get("/client/id/:id", [auth, client, validateObjectId], async (req, res) => {
  let customResponse = {};

  const visite = await Visite.findOne({ _id: req.params.id, user: req.user._id });
  if (!visite) {
    customResponse = new CustomResponse(404, 'visite non trouver');
    return res.send(customResponse);
  }

  customResponse = new CustomResponse(200, '', visite);
  res.send(customResponse);
});

module.exports = router;