var mongojs = require("mongojs");

var settings;

var CRUDModule = {};

CRUDModule.connect = function(server) {
    var db = mongojs(server, ['userSettings']);
    settings = db.collection("userSettings");
};

CRUDModule.findAllUsers = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    settings.find().limit(20).sort({postedOn: -1}, function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(200, success);
            return next();
        } else {
            return next(err);
        }

    });
};

CRUDModule.findUser = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    settings.findOne({msd: req.params.msd}, function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(200, success);
            return next();
        } else {
            res.send(200, {});
        }
        return next(err);
    })
};

CRUDModule.postNewUser = function (req, res, next) {
    var user = {};
    user.name = req.params.name;
    user.msd = req.params.msd;
    user.value = req.params.value;

    res.setHeader('Access-Control-Allow-Origin', '*');

    settings.save(user, function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(201, user);
            return next();
        } else {
            return next(err);
        }
    });
};

CRUDModule.deleteUser = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    settings.remove({msd: req.params.msd}, function (err, success) {
        console.log('Response success ' + success);
        console.log('Response error ' + err);
        if (success) {
            res.send(200);
            return next();
        } else {
            return next(err);
        }
    })
};

exports = module.exports = CRUDModule;