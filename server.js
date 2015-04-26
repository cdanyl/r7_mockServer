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
//server.get({path: PATH + '/getUsers', version: API_VERSION}, crud.findAllUsers);
//server.get({path: PATH + '/getUser', version: API_VERSION}, crud.findUser);
//server.post({path: PATH, version: API_VERSION}, crud.postNewUser);
//server.get({path: PATH + '/deleteUser', version: API_VERSION}, crud.deleteUser);

server.get({path: PATH + '/:key', version: API_VERSION}, crud.getUser);
server.post({path: PATH + '/:key', version: API_VERSION}, crud.postNewUser);

server.opts(PATH + '/:key', function( req, res, next ) {
    res.header( 'Access-Control-Allow-Origin', '*' );
    res.header( 'Access-Control-Allow-Method', 'POST, GET, PUT, DELETE, OPTIONS' );
    res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-File-Name, Content-Type, Cache-Control, X-CPGRP-STB' );
    if( 'OPTIONS' == req.method ) {
        res.send( 200, 'OK' );
    }
    next();
});

/**
 * Routes
 */
server.listen(Config.AMAZON_PORT, Config.AMAZON_SERVER, function () {
    console.log('%s listening at %s ', server.name, server.url);
});