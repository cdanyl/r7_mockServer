/**
 * Module dependencies.
 */
var mongoose = require("mongoose");

/**
 * Mongo db schema
 */
var UserSettingsSchema = new mongoose.Schema({
    msd: {type: String, index: {unique: true}},
    config: Object
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id
        }
    }
});

/**
 * Mongo db model
 */
var userSettingsModel = mongoose.model('userSettingsModel', UserSettingsSchema, 'userSettings');

/**
 * When successfully connected.
 */
var isConnected = false;

/**
 * @param {string} header you need to have req.headers['x-cpgrp-stb']
 * @return {(string|boolean)} MSD or false otherwise
 */
function getMSD(header) {
    var matches = (/MSD:(.*) IFF:(.*)/g).exec(header || '');
    var msd = matches && matches[1];
    return msd = (!!msd) ? msd : false;
}

/**
 * @class Initialize a new `CRUDModule`.
 */
function CRUDModule() {}

CRUDModule.prototype.connect = function (server) {
    if (!isConnected) {
        mongoose.connection.on('connected', function () {
            console.log('Mongoose connection open on : ' + server);
            isConnected = true;
        });

        mongoose.connection.on('error', function () {
            console.log('Mongoose connection error. Disconnecting');
            isConnected = false;
        });

        mongoose.connection.on('close', function () {
            console.log('Mongoose connection closed. Disconnected');
            isConnected = false;
        });

        mongoose.connect(server);
    }
};

CRUDModule.prototype.getUser = function (req, res, next) {

    var msd = getMSD(req.headers['x-cpgrp-stb']);

    if (msd) {
        return userSettingsModel.findOne({msd: msd}, function (err, user) {
            if (!user) {
                res.send(404, 'msd ' + msd + ' not exist');
                next.ifError(err);
            }
            res.send(user);
            next();
        });
    }
    res.send(404, 'no MSD in header');
};

CRUDModule.prototype.postNewUser = function (req, res, next) {

    var msd = getMSD(req.headers['x-cpgrp-stb']);

    if (msd) {
        var userSettings = new userSettingsModel({
            msd: msd,
            config: req.body
        });

        var query = {msd: msd};

        return userSettingsModel.findOneAndUpdate(query, userSettings, {upsert: true}, function (err, user) {
            if (err) {
                console.error(err);
                next.ifError(err);
            }
            res.send(userSettings);
            next();
        });
    }
    res.send(404, 'no MSD in header');

};

CRUDModule.prototype.deleteUser = function (req, res, next) {
    userSettingsModel.remove({msd: req.params.msd}, function (err, user) {
        if (user) {
            res.send(200);
            return next();
        } else {
            console.error(err);
            return next(err);
        }
    });
};

/**
 * Expose `CRUDModule`.
 */
module.exports = CRUDModule;