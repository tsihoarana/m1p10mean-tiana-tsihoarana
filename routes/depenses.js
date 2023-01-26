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

router.post("/atelier/create", [auth], async (req, res) => {
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

module.exports = router;