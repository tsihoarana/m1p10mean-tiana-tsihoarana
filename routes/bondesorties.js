const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
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

router.post("/atelier/visite/:id/create", [auth, atelier, validateObjectId], async (req, res) => {
    let customResponse = {};

    const { error } = validate(req.body);
    if (error) {
        customResponse = new CustomResponse(400, error.details[0].message);
        return res.send(customResponse);
    }

    const visite = await Visite.findById( req.params.id );
    if (!visite) {
        customResponse = new CustomResponse(404, "visite non trouver");
        return res.send(customResponse);
    }
    if (visite.etat != CustomConfig.VISITE_TERMINER_NON_PAYE) {
        customResponse = new CustomResponse(400, "visite non valide");
        return res.send(customResponse);
    }
    if (!visite.isAllReparationFinished()) {
        customResponse = new CustomResponse(400, "visite non terminé");
        return res.send(customResponse);
    }

    const unique_bon = await Bondesortie.findOne({ visite: visite._id });
    if (unique_bon) {
        customResponse = new CustomResponse(400, "Bon de sortie deja existant");
        return res.send(customResponse);
    }

    const bondesortie = new Bondesortie({
        visite: req.params.id,
        prix: visite.sommeReparation(),
        user: visite.user
    });

    visite.etat = CustomConfig.VISITE_TERMINER_NON_PAYE;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await visite.save({ session });
        await bondesortie.save({ session });
        
        await session.commitTransaction();

        customResponse = new CustomResponse(200, '', bondesortie);
        res.send(customResponse);
    } catch (err) {
        await session.abortTransaction();
        customResponse = new CustomResponse(500, "Something went wrong");
        res.send(customResponse);
    }
    session.endSession();
});

router.post("/financier/:id/payer", [auth, financier, validateObjectId], async (req, res) => {
    let customResponse = {};

    let bondesortie = await Bondesortie.findById(req.params.id);
    if (!bondesortie) {
        customResponse = new CustomResponse(404, "bon de sortie non trouver");
        return res.send(customResponse);
    }
    if (bondesortie.etat != CustomConfig.BON_DE_SORTIE_NON_PAYE) {
        customResponse = new CustomResponse(400, "bon de sortie non valide");
        return res.send(customResponse);
    }

    bondesortie.etat = CustomConfig.BON_DE_SORTIE_PAYE;
    bondesortie.date_paye = req.body.date_paye || new Date();
    
    let visite = await Visite.findById(bondesortie.visite);
    visite.etat = CustomConfig.VISITE_PAYE;

    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await visite.save({ session });
        await bondesortie.save({ session });
        
        await session.commitTransaction();

        customResponse = new CustomResponse(200, '', bondesortie);
        res.send(customResponse);
    } catch (err) {
        await session.abortTransaction();
        customResponse = new CustomResponse(500, "Something went wrong");
        res.send(customResponse);
    }
    session.endSession();
});

router.get("/client", [auth, client], async (req, res) => {
    const etat_query = req.query.etat ? { etat: req.query.etat } : {};
    const user_query = { user: req.user._id };
    const bondesortie = await Bondesortie
      .find()
      .and([etat_query, user_query]);

    const customResponse = new CustomResponse(200, '', bondesortie);
    res.send(customResponse);
});

router.get("/financier", [auth, financier], async (req, res) => {
    const etat_query = req.query.etat ? { etat: req.query.etat } : {};
    const bondesortie = await Bondesortie
      .find(etat_query);

    const customResponse = new CustomResponse(200, '', bondesortie);
    res.send(customResponse);
});

router.get("/financier/:id", [auth, financier, validateObjectId], async (req, res) => {
    let customResponse = {};

    const bondesortie = await Bondesortie.findById(req.params.id);
    if (!bondesortie) {
        customResponse = new CustomResponse(404, "bon de sortie non trouver");
        return res.send(customResponse);
    }

    customResponse = new CustomResponse(200, '', bondesortie);
    res.send(customResponse);
});

router.get("/atelier", [auth, atelier], async (req, res) => {
    const etat_query = req.query.etat ? { etat: req.query.etat } : {};
    const bondesortie = await Bondesortie
      .find(etat_query);

    const customResponse = new CustomResponse(200, '', bondesortie);
    res.send(customResponse);
});

module.exports = router;