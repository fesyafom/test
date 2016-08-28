var querystring = require("querystring");

function toJSON(data) {
    var result = [];
    if(!/\n/.test(data) && /=/.test(data)) {                                                        //if data inserted from form
        result = querystring.parse(data);
    }
    else if (/\n\r\n/.test(data)) {
        var arr = data.split(/\n\r\n/);
        for (var j = 0; j < arr.length; j++) {
            if(!/^------/.test(arr[j])) {
                return toJSON(arr[j]);
            }
        }
    }
    else if(/\n\n/.test(data)) {                                                  //if data inserted from file
        var arr = data.split(/\n\n/);
        for(var i = 0; i < arr.length; i++) {
            if(arr[i].length > 1) {
                var obj = querystring.parse(arr[i],/\n/,": ");
                result.push(obj);
            }
        }
    }
    return result;
}

function getIdFromPath (pathname) {
    var resultPathName = pathname;
    resultPathName = resultPathName.split('');
    for(var i = resultPathName.length; i >= 0; i--) {
        if(!/^[a-z0-9]/.test(resultPathName[i-1])) {
            return resultPathName.slice(i).join('');
        }
    }
}

exports.toJSON = toJSON;
exports.getIdFromPath = getIdFromPath;

