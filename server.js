var restify = require('restify');

///--- PROJECT MODULES
var Config = require('./config');
var crud = require('./crud');

///--- API VERSION
var API_VERSION = '0.0.1';

var server = restify.createServer({
    name: "user settings mock server"
});

server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

///--- Connect to database
crud.connect(Config.DB_SERVER + ':' + Config.DB_PORT + '/' + Config.DB_NAME);

///--- Routes
var PATH = '/userSettings';
server.get({path: PATH + '/getUsers', version: API_VERSION}, crud.findAllUsers);
server.get({path: PATH + '/getUser', version: API_VERSION}, crud.findUser);
server.post({path: PATH, version: API_VERSION}, crud.postNewUser);
server.get({path: PATH + '/deleteUser', version: API_VERSION}, crud.deleteUser);

///--- Start server
server.listen(Config.AMAZON_PORT, Config.AMAZON_SERVER, function () {
    console.log('%s listening at %s ', server.name, server.url);
});