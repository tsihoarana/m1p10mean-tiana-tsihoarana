const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Bondesortie, validate } = require("../models/bondesortie");
const { Visite } = require("../models/visite");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.post("/atelier/visite/:id/create", [auth, atelier, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat != 0) return res.status(400).send("visite non valide");
    if (!visite.isAllReparationFinished()) return res.status(400).send("visite non terminé");

    const bondesortie = new Bondesortie({
        visite: req.params.id,
        prix: visite.sommeReparation()
    });

    visite.etat = 1;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        await visite.save({ session });
        await bondesortie.save({ session });
        
        await session.commitTransaction();

        res.send(bondesortie);
    } catch (err) {
        await session.abortTransaction();
        res.status(500).send("Something went wrong");
    }
    session.endSession();
});
  
module.exports = router;