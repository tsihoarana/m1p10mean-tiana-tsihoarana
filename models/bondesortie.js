const Joi = require("joi");
const mongoose = require("mongoose");
const CustomConfig = require("./customConfig");

const bondesortieSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
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
  },
  date_paye: {
    type: Date
},
});

bondesortieSchema.statics.chiffreAffaire = async function (date_start, date_end) {
  const query = [
    { date_paye: { $gte: date_start , $lte: date_end, $exists: true } },
    { etat: CustomConfig.BON_DE_SORTIE_PAYE }
  ];
  const bondesorties = await this
    .find()
    .and(query);
  
  return bondesorties.reduce((acc, bondesortie) => acc + bondesortie.prix, 0);
}

bondesortieSchema.statics.chiffreAffaireDuMois = async function (year, month) {
  year = parseInt(year);
  month = parseInt(month);
  const start = new Date(year, month, 1);
	const end = new Date(year, month + 1, 0);
  const query = [
    { date_paye: {$gte: start, $lte: end} },
    { etat: CustomConfig.BON_DE_SORTIE_PAYE }
  ];
  const bondesorties = await this
    .find()
    .and(query);
  
  return bondesorties.reduce((acc, bondesortie) => acc + bondesortie.prix, 0);
}

bondesortieSchema.statics.chartData = async function (year) {
  const months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 
    'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
  let result = [];

  for (const [i, month] of months.entries()) {
    let value = await Bondesortie.chiffreAffaireDuMois(year, i);
    result.push({ mois: month, chiffre_affaire: value });
  }

  return result;
}

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