var restify = require('restify'),
    mongojs = require('mongojs'),
    should = require('should');

///--- PROJECT MODULES
var Config = require('../config');
var crud = require('../crud');

///--- Globals
var SERVER,
    TEST_PORT = '2387',
    TEST_SERVER = '127.0.0.1';

describe('Routing', function () {

    before(function (done) {
        try {

            // Mongo
            crud.connect(Config.DB_SERVER + ':' + Config.DB_PORT + '/' + Config.DB_NAME);

            SERVER = restify.createServer({
                name: "user settings mock server"
            });

            SERVER.use(restify.acceptParser(['json', 'text/plain']));
            SERVER.use(restify.jsonp()); // Added for GH-778
            SERVER.use(restify.dateParser());
            SERVER.use(restify.authorizationParser());
            SERVER.use(restify.queryParser());
            SERVER.use(restify.bodyParser());

            SERVER.get('/userSettings/getUsers', crud.findAllUsers);
            SERVER.get('/userSettings/getUser', crud.findUser);
            SERVER.post('/userSettings', crud.postNewUser);
            SERVER.get('/userSettings/deleteUser', crud.deleteUser);

            SERVER.listen(TEST_PORT, TEST_SERVER, function () {
                console.log('%s listening at %s', SERVER.name, SERVER.url);
                TEST_PORT = SERVER.address().port;

                done();
            });
        } catch (e) {
            console.error(e.stack);
            process.exit(1);
        }
    });

    after(function (done) {
        try {
            SERVER.close(function () {
                SERVER = null;
                done();
            });
        } catch (e) {
            console.error(e.stack);
            process.exit(1);
        }
    });

    it('Try to get all users', function (done) {
        var client = restify.createJsonClient('http://' + TEST_SERVER + ':' + TEST_PORT);
        client.agent = false;

        client.get('/userSettings/getUsers', function (err, req, res, obj) {
            res.statusCode.should.equal(200);
            done();
        });
    });

    it('Try to post a new user', function (done) {
        var client = restify.createJsonClient('http://' + TEST_SERVER + ':' + TEST_PORT);
        client.agent = false;

        var user = {
            name: 'Testname',
            msd: '1234',
            value: {'tt': 'tt'}
        };

        client.post('/userSettings', user, function (err, req, res, obj) {
            res.statusCode.should.equal(201);
            res.body.should.equal(JSON.stringify(obj));
            done();
        });
    });

    it('Try to find a user by msd', function (done) {
        var client = restify.createJsonClient('http://' + TEST_SERVER + ':' + TEST_PORT);
        client.agent = false;

        client.get('/userSettings/getUser?msd=1234', function (err, req, res, obj) {
            obj.msd.should.equal('1234');
            res.statusCode.should.equal(200);
            done();
        });
    });

});