/**
 * Module dependencies.
 */
var mongoose = require("mongoose");

/**
 * When successfully connected.
 */
var isConnected = false;

var UserSettingsSchema = new mongoose.Schema({
    name: String,
    msd: {type: String, index: {unique: true}},
    value: Object
});

var userSettingsModel = mongoose.model('userSettingsModel', UserSettingsSchema, 'userSettings');

/**
 * @class Initialize a new `CRUDModule`.
 */
function CRUDModule() {
}

CRUDModule.prototype.connect = function (server) {
    console.log("server");
    console.dir(server);
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

CRUDModule.prototype.findAllUsers = function (req, res, next) {

    userSettingsModel.find({}, function (err, users) {
        if (users) {
            res.send(200, users);
            return next();
        } else {
            console.error(err);
            return next(err);
        }

    }).sort({postedOn: -1});
};

CRUDModule.prototype.findUser = function (req, res, next) {

    userSettingsModel.findOne({msd: req.params.msd}, function (err, user) {
        if (user) {
            res.send(200, user);
            return next();
        } else {
            console.error(err);
            res.send(200, 'msd ' + req.params.msd + ' not exist');
        }
        return next(err);
    });
};

CRUDModule.prototype.postNewUser = function (req, res, next) {

    var userSettings = new userSettingsModel({
        name: req.params.name,
        msd: req.params.msd,
        value: req.params.value
    });

    var query = {msd: req.params.msd};

    userSettingsModel.findOneAndUpdate(query, req.body, {upsert: true}, function (err, user) {
        console.log(user);
        if (user) {
            res.send(201, userSettings);
            return next();
        } else {
            console.error(err);
        }
        return next(err);
    });
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