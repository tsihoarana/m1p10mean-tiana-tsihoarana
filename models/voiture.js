const Joi = require("joi");
const boolean = require("joi/lib/types/boolean");
const mongoose = require("mongoose");
const { userSchema } = require("../models/user");

const visiteSchema = new mongoose.Schema({
  voiture: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  date_entree: Date,
  date_sortie: Date
});

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
  valid: {
    type: Boolean,
    default: false
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
