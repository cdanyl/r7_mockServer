var restify = require('restify');
var mongojs = require("mongojs");

// PROJECT MODULES
var Config = require('./config');

/* API VERSION */
var API_VERSION = '0.0.1';

var server = restify.createServer({
    name: "user settings mock server"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

// Mongo
var connection_string = Config.DB_SERVER + ':' + Config.DB_PORT + '/' + Config.DB_NAME;
var db = mongojs(connection_string, ['userSettings']);
var settings = db.collection("userSettings");

// Routes
var PATH = '/userSettings';
server.get({path: PATH + '/getUsers', version: API_VERSION}, findAllUsers);
server.get({path: PATH + '/getUser', version: API_VERSION}, findUser);
server.post({path: PATH, version: API_VERSION}, postNewUser);
server.get({path: PATH + '/deleteUser', version: API_VERSION}, deleteUser);

function findAllUsers(req, res, next) {
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
}

function findUser(req, res, next) {
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
}

function postNewUser(req, res, next) {
    var user = {};
    user.name = req.params.name;
    user.msd = req.params.msd;
    user.value = req.params.value;
    user.postedOn = new Date();

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
}

function deleteUser(req, res, next) {
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
}

// Server Connection
server.listen(Config.AMAZON_PORT, Config.AMAZON_SERVER, function () {
    console.log('%s listening at %s ', server.name, server.url);
});