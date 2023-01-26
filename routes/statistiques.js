const auth = require("../middleware/auth");
const financier = require("../middleware/financier");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Bondesortie, validate } = require("../models/bondesortie");
const { Visite } = require("../models/visite");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.get("/financier/chiffre_affaire", [auth, financier], async (req, res) => {
    let chiffre_affaire = await Bondesortie.chiffreAffaire(req.query.debut, req.query.fin);
    chiffre_affaire = { chiffre_affaire, debut: req.query.debut, fin: req.query.end_date };

    const customResponse = new CustomResponse(200, '', chiffre_affaire);
    res.send(customResponse);
});

router.get("/financier/chiffre_affaire/mois", [auth], async (req, res) => {
    let chiffre_affaire = await Bondesortie.chiffreAffaireDuMois(req.query.annee, req.query.mois);
    chiffre_affaire = { chiffre_affaire, annee: req.query.annee, mois: req.query.mois };

    const customResponse = new CustomResponse(200, '', chiffre_affaire);
    res.send(customResponse);
});

router.get("/financier/reparation_moyenne", [auth, financier], async (req, res) => {
    let reparation_moyenne = await Visite.reparationMoyenne();
    reparation_moyenne = { reparation_moyenne };

    const customResponse = new CustomResponse(200, '', reparation_moyenne);
    res.send(customResponse);
});

module.exports = router;