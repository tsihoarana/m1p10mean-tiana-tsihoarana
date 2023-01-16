const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
const { reparationSchema } = require("../models/reparation");

const visiteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    voiture: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    etat: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    date_debut: {
        type: Date
    },
    date_fin: {
        type: Date
    },
    date_recup: {
        type: Date
    },
    reparations: {
        type: [reparationSchema]
    }
});

const Visite = mongoose.model("Visite", visiteSchema);

function validateVisite(visite) {
    const schema = {
            etat: Joi.Number()
            .min(0)
            .required()
    };

    return Joi.validate(visite, schema);
}

exports.visiteSchema = visiteSchema;
exports.Visite = Visite;