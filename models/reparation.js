const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const reparationSchema = new mongoose.Schema({
  duree: {
    type: Number,
    required: true,
    min: 0,
    max: 1500
  },
  piece: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  avancement: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  }
});

const Reparation = mongoose.model("Reparation", reparationSchema);

function validateReparation(reparation) {
    const schema = {
        duree: Joi.number()
        .min(0)
        .max(1500)
        .required(),
        piece: Joi.string()
        .min(3)
        .max(255)
        .required(),
        avancement: Joi.number()
        .min(0)
        .max(10)
        .required(),
        prix: Joi.number()
        .min(0)
        .required()
    };
  
    return Joi.validate(reparation, schema);
}

exports.reparationSchema = reparationSchema;
exports.Reparation = Reparation;
exports.validate = validateReparation;