const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const client = require("../middleware/client");
const financier = require("../middleware/financier");
const validateObjectId = require("../middleware/validateObjectId");
const _ = require("lodash");
const { Depense, validate } = require("../models/depense");
const CustomResponse = require("../models/customResponse");
const CustomConfig = require("../models/customConfig");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.post("/atelier/create", [auth, financier], async (req, res) => {
    let customResponse = {};
  
    const { error } = validate(req.body);
    if (error) {
      customResponse = new CustomResponse(400, error.details[0].message);
      return res.send(customResponse);
    }

    const depense = new Depense(_.pick(req.body, ["date", "type", "prix"]));

    await depense.save();

    customResponse = new CustomResponse(200, '', depense);
    return res.send(customResponse);
});

router.put("/atelier/:id", [auth, financier, validateObjectId], async (req, res) => {
    let customResponse = {};
  
    const { error } = validate(req.body);
    if (error) {
      customResponse = new CustomResponse(400, error.details[0].message);
      return res.send(customResponse);
    }
    let depense = await Depense.findById( req.params.id );
    if (!depense) {
      customResponse = new CustomResponse(404, 'Depense non trouver.');
      return res.send(customResponse);
    }
    depense.setDate(req.body.date);
    depense.setType(req.body.type);
    depense.setPrix(req.body.prix);

    await depense.save();

    customResponse = new CustomResponse(200, '', depense);
    return res.send(customResponse);
});

router.delete("/atelier/:id", [auth, financier, validateObjectId], async (req, res) => {
    let customResponse = {};

    let depense = await Depense.findById( req.params.id );
    if (!depense) {
      customResponse = new CustomResponse(404, 'Depense non trouver.');
      return res.send(customResponse);
    }

    await depense.delete();

    customResponse = new CustomResponse(200, '', depense);
    return res.send(customResponse);
});

module.exports = router;