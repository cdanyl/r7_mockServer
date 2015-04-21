var restify = require('restify');
var Config = require('../config');

// init the test client
var client = restify.createJsonClient({
    version: '0.0.1',
    url: 'http://localhost:3000'
});

describe('service: hello', function () {

    // Test #1
    describe('200 response check', function () {
        it('should get a 200 response', function (done) {
            client.get('/userSettings/getUsers', function (err, req, res, data) {
                if (err) {
                    throw new Error(err);
                }
                else {
                    if (data.code != 200) {
                        throw new Error('invalid response from /userSettings/getUsers');
                    }
                    done();
                }
            });
        });
    });
    // Add more tests as needed...
});