const auth = require("../middleware/auth");
const atelier = require("../middleware/atelier");
const financier = require("../middleware/financier");
const CustomResponse = require("../models/customResponse");
const { sendMail } = require('../models/mailConfig');
const express = require("express");
const router = express.Router();

router.get("/financier/send", [auth, financier], async (req, res) => {
    await sendMail(req.body.email, req.body.name, req.body.ref);
  
    const customResponse = new CustomResponse(200, 'mail envoyé');
    res.send(customResponse);
});

module.exports = router;