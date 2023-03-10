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

depenseSchema.methods.setType = function(type) {
    if (type)
        this.type = type;
}

depenseSchema.methods.setPrix = function(prix) {
    if (prix)
        this.prix = prix;
}

depenseSchema.methods.setDate = function(date) {
    if (date)
        this.date = date;
}

depenseSchema.statics.duMois = async function(year, month) {
    year = parseInt(year);
    month = parseInt(month);
    const start = new Date(year, month, 1);
	const end = new Date(year, month + 1, 0);
    const query = { date: {$gte: start, $lte: end} };
    const depenses = await this.find(query);

    return depenses.reduce((acc, depense) => acc + depense.prix, 0);
}

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