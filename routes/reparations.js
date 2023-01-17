const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Reparation, validate } = require("../models/reparation");
const { Visite } = require("../models/visite");
const express = require("express");
const router = express.Router();

router.post("/atelier/create/:id", [auth, atelier, validateObjectId], async (req, res) => {
    req.params.visite_id = req.params.id;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const visite = await Visite.findById( req.params.visite_id );
    if (!visite) return res.status(404).send("visite non trouver");
    if (visite.etat != 0) return res.status(400).send("visite non valide");

    let reparation = new Reparation(_.pick(req.body, 
        ["piece", "duree", "avancement", "prix"]));
    
    visite.reparations.push(reparation);

    await visite.save();

    res.send(reparation);
});

  
module.exports = router;
  