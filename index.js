var server = require("./server");
var router = require("./router");
var configuration = require("./configuration/configuration");

server.start(router.route, configuration);