var os = require('os'); //to find out current ip

var utilsMockServer = {};

/**
 * Function that returns a string with the public local ip address.
 * If many available, the firs one provided by the os will be returned.
 *
 * @returns {String} Public IP address formated like in 192.168.1.12
 */
utilsMockServer.getLocalIp = function(){
    var interfaces = os.networkInterfaces();
    var addresses = [];
    var address;
    for (var i in interfaces) {
        for (var j in interfaces[i]) {
            address = interfaces[i][j];
            if (address.family == 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    console.log("Found the following list of public addresses: %s", addresses.join(", "));
    return addresses[0];
};

exports = module.exports = utilsMockServer;