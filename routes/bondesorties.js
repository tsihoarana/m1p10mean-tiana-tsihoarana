const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
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

    const bondesortie = new Bondesortie({
        visite: req.params.id,
        prix: visite.sommeReparation()
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

router.post("/financier/:id/payer", [auth, atelier, validateObjectId], async (req, res) => {
    let customResponse = {};


});
  
module.exports = router;