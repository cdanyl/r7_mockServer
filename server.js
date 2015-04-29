var restify = require('restify');

/**
 * Project Modules
 */
var Config = require('./config');
var Crud = require('./crud');

/**
 * API Version
 */
var API_VERSION = '0.0.1';

/**
 * Instantiate the server
 */
var server = restify.createServer({ name: "user settings mock server" });

server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

/**
 * Connect to database
 */
var crud = new Crud();
crud.connect(Config.DB_SERVER + ':' + Config.DB_PORT + '/' + Config.DB_NAME);

/**
 * Routes
 */
var PATH = '/userSettings';
server.opts(PATH + '/:key', crud.authenticate);
//server.get({path: PATH + '/getUsers', version: API_VERSION}, crud.findAllUsers);
server.get({path: PATH + '/:store', version: API_VERSION}, crud.getUserSettings);
server.post({path: PATH + '/:store', version: API_VERSION}, crud.postUserSettings);
server.put({path: PATH + '/:store', version: API_VERSION}, crud.postUserSettings);
server.del({path: PATH + '/:store', version: API_VERSION}, crud.deleteUserSettings);

/**
 * Routes
 */
server.listen(Config.AMAZON_PORT, Config.AMAZON_SERVER, function () {
    console.log('%s listening at %s ', server.name, server.url);
});