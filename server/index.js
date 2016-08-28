var http = require("http");
var url = require("url");
var config = require("../config");

function start(route, handle) {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        var params = url.parse(request.url, true).query;                
        console.log("Request for " + pathname + " received.");
        route(handle, pathname,params, response, request);
    }

    http.createServer(onRequest).listen(config.get('webServerPort'));
    console.log("Server has started.");
}

exports.start = start;
