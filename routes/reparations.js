const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Reparation, validate } = require("../models/reparation");
const { Visite } = require("../models/visite");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.post("/atelier/create/visite/:id", [auth, atelier, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat != 0) return res.status(400).send("visite non valide");

    let reparation = new Reparation(_.pick(req.body, 
        ["piece", "duree", "avancement", "prix"]));
    reparation.visite = visite._id;
    
    visite.reparations.push(reparation);

    await visite.save();

    res.send(reparation);
});

router.get("/atelier/visite/:id", [auth, atelier, validateObjectId], async (req, res) => {
    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    // if (visite.etat != 0) return res.status(400).send("visite non valide");

    res.send(visite.reparations);
});

router.get("/client/visite/:id", [auth, client, validateObjectId], async (req, res) => {
    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat == 2) return res.status(400).send("visite deja terminée et payée");
    
    res.send(_.map(visite.reparations, obj => 
        _.pick(obj, ['_id', 'piece', 'duree', 'avancement']) ));
});

router.put("/atelier/visite/:id/reparation/:reparation_id", [auth, atelier, validateObjectId], async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.reparation_id))
        return res.status(404).send('Invalid ID.');

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat == 2) return res.status(400).send("visite deja terminée et payée");

    const reparation = visite.reparations.find(x => x._id == req.params.reparation_id);
    if (!reparation) return res.status(404).send("reparation non trouver");

    reparation.duree = req.body.duree;
    reparation.piece = req.body.piece;
    reparation.avancement = req.body.avancement;
    reparation.prix = req.body.prix;

    await visite.save();

    res.send(reparation);
});

router.delete("/atelier/visite/:id/reparation/:reparation_id", [auth, atelier, validateObjectId], async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.reparation_id))
        return res.status(404).send('Invalid ID.');

    const visite = await Visite.findById( req.params.id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat == 2) return res.status(400).send("visite deja terminée et payée");

    const reparation = visite.reparations.find(x => x._id == req.params.reparation_id);
    if (!reparation) return res.status(404).send("reparation non trouver");

    const deleted = visite.reparations.pop(reparation);

    await visite.save();

    res.send(deleted);
});
  
module.exports = router;
  