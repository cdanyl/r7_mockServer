var restify = require('restify');
var mongojs = require("mongojs");

/* SERVER CONFIGURATION */
var PORT = 3000;
var SERVER = "localhost";

/* MONGO CONFIGURATION */
var MONGO_PORT = 27017;
var MONGO_DBSERVER = "localhost";
var MONGO_DBNAME = "r7_userSettings";

var server = restify.createServer({
    name: "user settings mock server"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

var connection_string = MONGO_DBSERVER + ':' + MONGO_PORT + '/' + MONGO_DBNAME;
var db = mongojs(connection_string, ['userSettings']);
var settings = db.collection("userSettings");

var PATH = '/userSettings';
server.get({path: PATH + '/getUsers', version: '0.0.1'}, findAllUsers);
server.get({path: PATH + '/getUser', version: '0.0.1'}, findUser);
server.post({path: PATH, version: '0.0.1'}, postNewUser);
server.get({path: PATH + '/deleteUser', version: '0.0.1'}, deleteUser);

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

server.listen(PORT, SERVER, function () {
    console.log('%s listening at %s ', server.name, server.url);
});