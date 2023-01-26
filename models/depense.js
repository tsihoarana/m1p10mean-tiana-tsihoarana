const Joi = require("joi");
const mongoose = require("mongoose");

const depenseSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true
  },
});

const Depense = mongoose.model("Depense", depenseSchema);

function validateDepense(depense) {
    const schema = {
        type: Joi.string()
            .min(2)
            .required(),
        prix: Joi.number()
            .min(0)
            .required(),
        date: Joi.date()
            .min(0)
            .required()
    };
  
    return Joi.validate(depense, schema);
}

exports.depenseSchema = depenseSchema;
exports.Depense = Depense;
exports.validate = validateDepense;