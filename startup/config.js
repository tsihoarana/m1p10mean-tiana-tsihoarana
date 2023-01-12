const config = require('config');

module.exports = function() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
  console.log(`ito key ${config.get('jwtPrivateKey')}`);
}