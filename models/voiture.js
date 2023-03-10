const Joi = require("joi");
const mongoose = require("mongoose");

const { visiteSchema, Visite } = require("../models/visite");
const CustomConfig = require("./customConfig");

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
    type: Buffer,
    // get: (image) => {
    //   let u8 = new Uint8Array(image);
    //   return 'data:image/png;base64,' + Buffer.from(u8).toString('base64');
    // }
  },
  marque: {
    type: String,
    maxlength: 50
  },
  modele: {
    type: String,
    maxlength: 50
  },
  etat: {
    type: Number,
    default: 2
  },
  date_depot: {
    type: Date
  },
  visites: [ visiteSchema ]
});

voitureSchema.methods.setImage = function(imageStringBase64) {
  if (imageStringBase64)
    this.image = Buffer.from(imageStringBase64.split(",")[1],"base64");
}

voitureSchema.methods.setMarque = function(marque) {
  if (marque)
    this.marque = marque;
}

voitureSchema.methods.setModele = function(modele) {
  if (modele)
    this.modele = modele;
}

voitureSchema.methods.resetDateDepot = function() {
  this.date_depot = new Date();
}

voitureSchema.methods.isVisiteFinished = async function() {
  const visite = await Visite.findOne()
    .and([{ voiture: this._id }, { etat: { $ne: CustomConfig.VISITE_PAYE} }]);

  return visite ? false : true;
}

voitureSchema.methods.getLastUnpaidVisite = async function() {
  const visite = await Visite.findOne()
    .and([{ voiture: this._id }, { etat: { $ne: CustomConfig.VISITE_PAYE} }])
    .sort({date_debut: -1});

  return visite;
}

voitureSchema.methods.getLastPaidVisite = async function() {
  const visite = await Visite.findOne()
    .and([{ voiture: this._id }, { etat: { $eq: CustomConfig.VISITE_PAYE} }])
    .sort({date_debut: -1});

  return visite;
}

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
    numero: Joi.string().min(6).max(7).required(),
    image: Joi.string(),
    marque: Joi.string().max(50),
    modele: Joi.string().max(50)
  };

  return Joi.validate(voiture, schema);
}

exports.Voiture = Voiture;
exports.validate = validateVoiture;
