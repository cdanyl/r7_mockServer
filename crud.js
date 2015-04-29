/**
 * Module dependencies.
 */
var mongoose = require("mongoose");
var restify = require('restify');

/**
 * Mongo db schema
 */
var UserSettingsSchema = new mongoose.Schema({
    msd: {type: String, index: true},
    store: {type: String, index: true},
    data: Object
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
 * Get 'msd' from header, you need to have req.headers['x-cpgrp-stb'].
 * @return {(string|boolean)} MSD or false otherwise
 * @param header
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

/**
 * Only checks for HTTP Basic Header Authenticaion.
 *
 * Some handler before is expected to set the accepted header key/value combo.
 * on req as:
 *
 * req.headers = 'x-cpgrp-stb': 'MSD:0123 IFF:6512'.
 * @returns Otherwise return InvalidHeaderError.
 */
CRUDModule.prototype.authenticate = function (req, res, next) {

    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control, X-CPGRP-STB' );
    if( 'OPTIONS' == req.method ) {
        res.send( 200, 'OK' );
    }
    next();
};

CRUDModule.prototype.findAllUsers = function (req, res, next) {

    return userSettingsModel.find({}, function (err, users) {
        if (users) {
            res.send(200, users);
            return next();
        } else {
            next.ifError(err);
        }

    }).sort({postedOn: -1});
};

/**
 * Note this handler looks in `req.params` and 'req.header'.
 * Which must  have `key` and `msd` available in req.params.
 * Otherwise return/send an error to the client.
 * @param req
 * @param res
 * @param next
 * @returns Respond one document that satisfies the specified query criteria.
 */
CRUDModule.prototype.getUserSettings = function (req, res, next) {

    var store = req.params.store;
    if (!store) {
        req.log.warn('getUserSettings: missing query params');
        next(new restify.MissingParameterError('Missing a required parameter'));
        return;
    }

    var msd = getMSD(req.headers['x-cpgrp-stb']);

    if (!msd) {
        req.log.warn('getUserSettings: missing header MSD params');
        next(new restify.InvalidHeaderError('Missing MSD in header'));
        return;
    }

    return userSettingsModel.findOne({msd: msd, store: store}, function (err, settings) {
        if (!settings) {
            res.send(404, 'msd/store ' + msd + '/' + store + ' not exist');
            next.ifError(err);
        }

        res.send(settings.data);
        next();
    });

};

/**
 * Finds a matching 'msd', updates it according to the update arg. Otherwise creates the user if it doesn't exist.
 * Note this handler looks in `req.params` and 'req.header'.
 * Which must  have `key` and `msd` available in req.params.
 * Otherwise return/send an error to the client.
 * @param req
 * @param res
 * @param next
 * @returns Respond one document that satisfies the specified query criteria.
 */
CRUDModule.prototype.postUserSettings = function (req, res, next) {

    var store = req.params.store;
    if (!req.params.store) {
        req.log.warn('postUserSettings: missing query params');
        next(new restify.MissingParameterError('Missing a required parameter'));
        return;
    }

    var msd = getMSD(req.headers['x-cpgrp-stb']);

    if (!msd) {
        req.log.warn('postUserSettings: missing header MSD params');
        next(new restify.InvalidHeaderError('Missing MSD in header'));
        return;
    }

    var userSettings = new userSettingsModel({
        data: req.body
    });

    var query = {msd: msd, store: store};

    return userSettingsModel.findOneAndUpdate(query, userSettings, {upsert: true, new: true}, function (err, settings) {

        if (err) {
            res.send(404, 'no settings');
            next.ifError(err);
        }
        res.send(settings.data);
        next();
    });

};

/**
 * Note this handler looks in `req.params` and 'req.header'.
 * Which must  have `key` and `msd` available in req.params.
 * Otherwise return/send an error to the client.
 * @param req
 * @param res
 * @param next
 * @returns Delete the document that satisfies the specified query criteria.
 */
CRUDModule.prototype.deleteUserSettings = function (req, res, next) {

    var store = req.params.store;
    if (!req.params.store) {
        req.log.warn('deleteUserSettings: missing query params');
        next(new restify.MissingParameterError('Missing a required parameter'));
        return;
    }

    var msd = getMSD(req.headers['x-cpgrp-stb']);

    if (!msd) {
        req.log.warn('deleteUserSettings: missing header MSD params');
        next(new restify.InvalidHeaderError('Missing MSD in header'));
        return;
    }

    userSettingsModel.remove({msd: msd, store: store}, function (err, user) {
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