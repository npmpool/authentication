/**
 * Module dependencies.
 */
var Passport = require('./lib/authenticator');


/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Passport();
