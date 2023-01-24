const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Reparation, validate } = require("../models/reparation");
const { Visite } = require("../models/visite");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.post("/atelier/create/visite/:id", [auth, atelier, validateObjectId], async (req, res) => {
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
    if (visite.etat != CustomConfig.VISITE_ENCOURS) {
        customResponse = new CustomResponse(400, "visite non valide");
        return res.send(customResponse);
    }

    let reparation = new Reparation(_.pick(req.body, 
        ["piece", "duree", "avancement", "prix"]));
    reparation.visite = visite._id;
    
    visite.reparations.push(reparation);

    await visite.save();

    customResponse = new CustomResponse(200, '', reparation);
    res.send(customResponse);
});

router.get("/atelier/visite/:id", [auth, atelier, validateObjectId], async (req, res) => {
    let customResponse = {};

    const visite = await Visite.findById( req.params.id );
    if (!visite) {
        customResponse = new CustomResponse(404, 'visite non trouver');
        return res.send(customResponse);
    }
    // if (visite.etat != 0) return res.status(400).send("visite non valide");

    customResponse = new CustomResponse(200, '', visite.reparations);
    res.send(customResponse);
});

router.get("/client/visite/:id", [auth, client, validateObjectId], async (req, res) => {
    let customResponse = {};

    const visite = await Visite.findById( req.params.id );
    if (!visite) {
        customResponse = new CustomResponse(404, 'visite non trouver');
        return res.send(customResponse);
    }
    if (visite.etat == CustomConfig.VISITE_PAYE) {
        customResponse = new CustomResponse(400, 'visite deja terminée et payée');
        return res.send(customResponse);
    }
    
    customResponse = new CustomResponse(200, '', _.map(visite.reparations, obj => 
        _.pick(obj, ['_id', 'piece', 'duree', 'avancement']) ));
    res.send(customResponse);
});

router.put("/atelier/visite/:id/reparation/:reparation_id", [auth, atelier, validateObjectId], async (req, res) => {
    let customResponse = {};

    if (!mongoose.Types.ObjectId.isValid(req.params.reparation_id)) {
        customResponse = new CustomResponse(404, 'Invalid ID.');
        return res.send(customResponse);
    }

    const { error } = validate(req.body);
    if (error) {
        customResponse = new CustomResponse(400, error.details[0].message);
        return res.send(customResponse);
    }

    const visite = await Visite.findById( req.params.id );
    if (!visite) {
        customResponse = new CustomResponse(404, 'visite non trouver');
        return res.send(customResponse);
    }
    if (visite.etat == CustomConfig.VISITE_PAYE) {
        customResponse = new CustomResponse(400, 'visite deja terminée et payée');
        return res.send(customResponse);
    }

    const reparation = visite.reparations.find(x => x._id == req.params.reparation_id);
    if (!reparation) {
        customResponse = new CustomResponse(404, 'reparation non trouver');
        return res.send(customResponse);
    }

    reparation.duree = req.body.duree;
    reparation.piece = req.body.piece;
    reparation.avancement = req.body.avancement;
    reparation.prix = req.body.prix;

    await visite.save();

    customResponse = new CustomResponse(200, '', reparation);
    res.send(customResponse);
});

router.delete("/atelier/visite/:id/reparation/:reparation_id", [auth, atelier, validateObjectId], async (req, res) => {
    let customResponse = {};

    if (!mongoose.Types.ObjectId.isValid(req.params.reparation_id)) {
        customResponse = new CustomResponse(404, 'ID invalide');
        return res.send(customResponse);
    }

    const visite = await Visite.findById( req.params.id );
    if (!visite) {
        customResponse = new CustomResponse(404, 'visite non trouver');
        return res.send(customResponse);
    }
    if (visite.etat == CustomConfig.VISITE_PAYE) {
        customResponse = new CustomResponse(400, 'visite deja terminée et payée');
        return res.send(customResponse);
    }

    const reparation = visite.reparations.find(x => x._id == req.params.reparation_id);
    if (!reparation) {
        customResponse = new CustomResponse(404, 'reparation non trouver');
        return res.send(customResponse);
    }

    const deleted = visite.reparations.pop(reparation);

    await visite.save();

    customResponse = new CustomResponse(200, '', deleted);
    res.send(customResponse);
});
  
module.exports = router;
  