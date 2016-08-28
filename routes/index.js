function route(handle, pathname,params, response, request) {
    console.log("About to route a request for " + pathname);
    if (typeof handle[pathname] === 'function') {
        handle[pathname](params, response, request);
    } else {
        if(typeof handle[route.checkDynamicPath(pathname) + "*"] === 'function') {
            handle[route.checkDynamicPath(pathname) + "*"](params, response, request, pathname);
        }
        else {
            console.log("No request handler found for " + pathname);
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write("404 Not found");
            response.end();
        }
    }
}

route.checkDynamicPath = function (pathname) {
    var resultPathName = pathname;
    resultPathName = resultPathName.split('');
    for(var i = resultPathName.length; i >= 0; i--) {
        if(/^[a-z0-9]/.test(resultPathName[i-1])) {
            resultPathName.pop();
        }
        else break;
    }
    return resultPathName.join('');
};


exports.route = route;
