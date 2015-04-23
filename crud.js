var mongoose = require("mongoose");
var Schema = mongoose.Schema;

///--- When successfully connected
var isConnected = false;

var CRUDModule = {};

//CRUDModule.connect = function(server) {
//    var db = mongojs(server, ['userSettings']);
//    settings = db.collection("userSettings");
//};

CRUDModule.connect = function (server) {
    console.log("server");
    console.dir(server);
    if (!isConnected) {
        mongoose.connection.on('connected', function () {
            console.log('Mongoose connection open on : ' + server);
        });

        mongoose.connection.on('error', function () {
            console.log('Mongoose connection error. Disconnecting');
        });

        mongoose.connection.on('close', function () {
            console.log('Mongoose connection closed. Disconnected');
        });

        mongoose.connect(server);
    }
};

var UserSettingsSchema = new mongoose.Schema({
    name: String,
    msd: {type: String, index: {unique: true}},
    value: Object
});

var userSettingsModel = mongoose.model('userSettingsModel', UserSettingsSchema, 'userSettings');

CRUDModule.findAllUsers = function (req, res, next) {

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

CRUDModule.findUser = function (req, res, next) {

    userSettingsModel.findOne({msd: req.params.msd}, function (err, user) {
        if (user) {
            res.send(200, user);
            return next();
        } else {
            console.error(err);
            res.send(200, 'msd ' + req.params.msd + ' not exist');
        }
        return next(err);
    })
};

CRUDModule.postNewUser = function (req, res, next) {

    var userSettings = new userSettingsModel({
        name: req.params.name,
        msd: req.params.msd,
        value: req.params.value
    });

    var query = {msd: req.params.msd};

    userSettingsModel.findOneAndUpdate(query, req.body, {upsert: true}, function (err, user) {
        if (user) {
            res.send(201, userSettings);
            return next();
        } else {
            console.error(err);
            res.send(200, 'msd ' + req.params.msd + ' already exist');
        }
        return next(err);
    });
};

CRUDModule.deleteUser = function (req, res, next) {

    userSettingsModel.remove({msd: req.params.msd}, function (err, user) {
        if (user) {
            res.send(200);
            return next();
        } else {
            console.error(err);
            return next(err);
        }
    })
};

exports = module.exports = CRUDModule;