var restify = require('restify');
var mongojs = require("mongojs");
var Config = require('../config');
var should = require('should');

// init the test client
var client = restify.createJsonClient({
    version: '0.0.1',
    url: 'http://localhost:3000'
});

describe('Routing', function () {

    before(function (done) {
        // Mongo db connection
        var connection_string = Config.DB_SERVER + ':' + Config.DB_PORT + '/' + Config.DB_NAME;
        mongojs.connect(connection_string);
        done();
    });

    describe('service: getUsers', function () {

        //it('listen and close (port only)', function (t) {
        //    var server = restify.createServer();
        //    server.listen(4673, function () {
        //        server.close();
        //        });
        //    });

        //before(function() {
        //    server = restify.createServer();
        //    server.listen(4242);
        //});
        //
        //after(function(){
        //    server.close();
        //});

        it('should get a 200 response', function (done) {
            client.get('/userSettings/getUsers', function (err, req, res, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (res.code == 200) {
                        throw new Error('valid response from /userSettings/getUsers');
                    }
                    done();
                }
            });
        });

        //it('should Post a new user', function (done) {
        //    var user = {
        //        name: 'test name',
        //        msd: '1234',
        //        value: {'tt': 'tt'},
        //        postedOn: new Date()
        //    };
        //
        //    client
        //        .post('/userSettings')
        //        .send(201, user)
        //        .end(function (err, res) {
        //            if (err) {
        //                throw err;
        //            }
        //            // this is should.js syntax, very clear
        //            res.should.have.status(201);
        //            done();
        //        });
        //});

        describe('200 response check', function() {
            it('should get a 200 response', function(done) {
                    var user = {
                        name: 'test name',
                        msd: '1234',
                        value: {'tt': 'tt'},
                        postedOn: new Date()
                    };
                client.post('/userSettings', user, function(err, req, res, data) {
                    if (err) {
                        throw new Error(err);
                    }
                    else {

                        if (data.code != 201) {
                            throw new Error('valid response from /post');
                        }
                        done();
                    }
                });
            });
        });
    });
});