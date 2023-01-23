const Joi = require("joi");
const mongoose = require("mongoose");

const { visiteSchema } = require("../models/visite");

const voitureSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  numero: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 7,
    unique: true
  },
  image: {
    type: Buffer
  },
  etat: {
    type: Number,
    default: 2
  },
  visites: [ visiteSchema ]
});

const Voiture = mongoose.model("Voiture", voitureSchema);

function validateVisite(visite) {
  const schema = {
    accepted: Joi.boolean().required(),
    date_entree: Joi.date(),
    date_sortie: Joi.date()
  };
}

function validateVoiture(voiture) {
  const schema = {
    numero: Joi.string().min(6).max(7).required()
  };

  return Joi.validate(voiture, schema);
}

exports.Voiture = Voiture;
exports.validate = validateVoiture;
