var fs = require("fs"),
    mongodb = require('mongodb'),
    config = require("../config"),
    calculations = require("./calculations");

var connectDB = mongodb.MongoClient.connect;
var dbUrl = 'mongodb://' + config.get('mongoDB:ipAddr') + ":" + config.get('mongoDB:port') + "/" + config.get('mongoDB:dbName');


function films(params, response, request) {
    if (request.method === 'GET') {
        connectDB(dbUrl, function (err, db) {
            if (err) throw err;
            try {
                var collection = db.collection('films');
                collection.find({}).sort({Title: 1}).toArray(function(err, docs) {
                    if (err) throw err;
                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "GET",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });
                    response.end(JSON.stringify(docs));
                    db.close()
                });

            } catch (err) {
                response.statusCode = 400;
                response.end("Bad Request");
                db.close();
            }


        });
    }

    else if (request.method === 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            body = calculations.toJSON(body);
            console.log(body);
            if(body.length === 0) {
                response.statusCode = 415;
                response.end("Incorrect File Format");
            }
            else {
                connectDB(dbUrl, function(err, db) {
                    if(err) throw err;

                    var collection = db.collection('films');
                    collection.insert(body,function(err, results) {
                        if(err) throw err;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*',
                            "Access-Control-Allow-Methods": "POST",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                        });
                        response.end("SERVER: DATA INSERTED");
                        db.close();
                    });
                });
            }
        });
    }

}

function film(params, response, request, pathname) {
    var filmId = calculations.getIdFromPath(pathname);
    
    if (request.method === 'GET') {
        connectDB(dbUrl, function (err, db) {
            if (err) throw err;
            try {
                var collection = db.collection('films');
                collection.find({_id: new mongodb.ObjectID(filmId)}).toArray(function(err, docs) {
                    if (err) throw err;
                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "GET",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });
                    response.end(JSON.stringify(docs));
                    db.close()
                });
            } catch (err) {
                response.statusCode = 400;
                response.end("Bad Request");
                db.close();
            }


        });
    }
    else if (request.method === 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            if(body.length === 0) {
                connectDB(dbUrl, function(err, db) {
                    if(err) throw err;
                    var collection = db.collection('films');
                    collection.deleteOne({_id: new mongodb.ObjectID(filmId)},function(err, results) {
                        if(err) throw err;
                        response.writeHead(200, {
                            'Content-Type': 'text/plain',
                            'Access-Control-Allow-Origin': '*',
                            "Access-Control-Allow-Methods": "POST",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                        });
                        response.end("SERVER: DATA DELETED");
                        db.close();
                    });
                });
            }
        });
    }

}

function search(params, response, request) {
    if (request.method === 'GET') {
        connectDB(dbUrl, function (err, db) {
            if (err) throw err;
            var collection = db.collection('films');
            var regExp = new RegExp(params.str, 'i');
            var searchBy = params.by.charAt(0).toUpperCase() + params.by.substr(1);

            try {
                collection.find({[searchBy]: regExp }).sort({Title: 1}).toArray(function (err, docs) {
                    if (err) throw err;
                    response.writeHead(200, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "GET",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                    });
                    response.end(JSON.stringify(docs));
                    db.close()
                });
            } catch (err) {
                response.statusCode = 400;
                response.end("Bad Request");
                db.close();
        }
        });
    }
}

function upload(params, response) {
    fs.readFile(__dirname + '/../templates/inputForm.html', function (err, data) {
        if (err) console.log(err);
        response.statusCode = 200;
        response.setHeader('Content-Type','text/html');
        response.end(data);
    });
}

function client(params, response) {
    fs.readFile(__dirname + '/../templates/client/index.html', function (err, data) {
        if (err) console.log(err);
        response.statusCode = 200;
        response.setHeader('Content-Type','text/html');
        response.end(data);
    });
}

function clientCSS(params, response) {

    fs.readFile(__dirname + '/../templates/client/css/styles.css', function (err, data) {
        if (err) console.log(err);
        response.statusCode = 200;
        response.setHeader('Content-Type','text/css');
        response.end(data);
    });
}

function clientJS(params, response) {
    fs.readFile(__dirname + '/../templates/client/js/scripts.js', function (err, data) {
        if (err) console.log(err);
        response.statusCode = 200;
        response.setHeader('Content-Type','text/javascript');
        response.end(data);
    });
}

exports.films = films;
exports.film = film;
exports.search = search;
exports.upload = upload;

exports.client = client;
exports.clientCSS = clientCSS;
exports.clientJS = clientJS;

