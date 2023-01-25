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
    let chiffre_affaire = await Bondesortie.chiffreAffaire(req.body.start_date, req.body.end_date);
    chiffre_affaire = { chiffre_affaire, start_date: req.body.start_date, end_date: req.body.end_date };

    const customResponse = new CustomResponse(200, '', chiffre_affaire);
    res.send(customResponse);
});

module.exports = router;