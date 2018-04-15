'use strict';

var hapi = require('hapi');
var server = new hapi.Server();
var routes = require('./routes');

server.connection({
    port: 3000,
    host: 'localhost'
});

server.route(routes);

//start the server
server.start(function () {
    console.log('Listening on ' + server.info.uri);
});
