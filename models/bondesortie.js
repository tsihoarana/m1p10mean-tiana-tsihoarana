const Joi = require("joi");
const mongoose = require("mongoose");

const bondesortieSchema = new mongoose.Schema({
  visite: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  etat: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
});

const Bondesortie = mongoose.model("Bondesortie", bondesortieSchema);

function validateBondesortie(bondesortie) {
    const schema = {
        prix: Joi.number()
        .min(0),
        etat: Joi.number()
        .min(0)
    };
  
    return Joi.validate(bondesortie, schema);
}

exports.bondesortieSchema = bondesortieSchema;
exports.Bondesortie = Bondesortie;
exports.validate = validateBondesortie;