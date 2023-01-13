const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const voitures = require('../routes/voitures');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/voitures', voitures);
  app.use(error);
}