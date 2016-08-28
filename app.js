var server = require("./server");
var router = require("./routes");
var requestHandlers = require("./request_handlers");

var handle = {};
handle["/films"] = requestHandlers.films;
handle["/films/*"] = requestHandlers.film;
handle["/search"] = requestHandlers.search;
handle["/upload"] = requestHandlers.upload;

handle["/"] = requestHandlers.client;
handle["/css/styles.css"] = requestHandlers.clientCSS;
handle["/js/scripts.js"] = requestHandlers.clientJS;

server.start(router.route, handle);
