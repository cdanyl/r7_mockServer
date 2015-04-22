var utils = require('./utils');

/**
 * This module contains constants and parameters.
 * @type {Object}
 */
var Config = {
    DB_SERVER: "localhost",
    DB_PORT: 27017,
    DB_NAME: "r7_userSettings",
    AMAZON_SERVER: utils.getLocalIp(),
    AMAZON_PORT: 3000
};

exports = module.exports = Config;