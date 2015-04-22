#Mock Server for user settings storage#


## API ##

| Routes                        | HTTP Verb     | Description                |
| ------------------------------|:--------------|:---------------------------|
| /userSettings/getUsers        | GET           | Get all the users          |
| /userSettings                 | POST          | Create a new user settings |
| /userSettings/getUser?msd=    | GET           | Get a single user          |
| /userSettings/deleteUser?msd= | GET           | Delete a user setting      |

### Connect to the server ###
Use the Amazon AWS public adress: 

Unit Test
-------------
The test framework of choice for this mock server is Mocha:
http://visionmedia.github.io/mocha/
 1. along with Supertest for HTTP assertions https://github.com/visionmedia/supertest
 2. and Should.js for BDD style tests https://github.com/visionmedia/should.js
Mocha is a great choice because it makes async test natural and fluent.