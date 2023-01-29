const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const voitures = require('../routes/voitures');
const visites = require('../routes/visites');
const reparations = require('../routes/reparations');
const bondesorties = require('../routes/bondesorties');
const statistiques = require('../routes/statistiques');
const depenses = require('../routes/depenses');
const mail = require('../routes/mail');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/voitures', voitures);
  app.use('/api/visites', visites);
  app.use('/api/reparations', reparations);
  app.use('/api/bondesorties', bondesorties);
  app.use('/api/statistiques', statistiques);
  app.use('/api/depenses', depenses);
  app.use('/api/mail', mail);
  app.use(error);
}