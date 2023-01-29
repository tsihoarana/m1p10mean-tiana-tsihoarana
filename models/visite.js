const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");
const { reparationSchema } = require("../models/reparation");
const CustomConfig = require("./customConfig");


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
        type: Date,
        default: new Date()
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

visiteSchema.methods.sommeReparation = function () {
    return this.reparations.reduce((acc, reparation) => acc + reparation.prix, 0);
};

visiteSchema.methods.sommeDureeReparation = function () {
    return this.reparations.reduce((acc, reparation) => acc + reparation.duree, 0);
};

visiteSchema.statics.reparationMoyenne = async function () {
    const visites = await this.find({});
    let sum = 0;
    visites.forEach((visite) => {
        sum += visite.sommeDureeReparation();
    }, sum);

    return sum / visites.length;
};

visiteSchema.methods.isAllReparationFinished = function () {
    this.finished = true;
    this.reparations.every((reparation) => {
        if (reparation.avancement != CustomConfig.REPARATION_TERMINER) {
            this.finished = false;
            return false;
        }
        return true;
    });
    return this.finished;
};

const Visite = mongoose.model("Visite", visiteSchema);

function validateVisite(visite) {
    const schema = {
        etat: Joi.Number().min(0).required()
    };

    return Joi.validate(visite, schema);
}

exports.visiteSchema = visiteSchema;
exports.Visite = Visite;