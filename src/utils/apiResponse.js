"use strict";
exports.__esModule = true;
exports.errorHandler = exports.successHandler = void 0;
exports.successHandler = function (callback, results) {
    console.log('successHandler', { results: results });
    return responseHandler(callback, results, 200);
};
exports.errorHandler = function (callback, msg, error) {
    console.log('errorHandler', { msg: msg, error: error });
    var response = {
        message: msg,
        errorDetails: error,
    };
    return responseHandler(callback, response, 500);
};
var responseHandler = function (callback, response, statusCode) {
    callback(null, {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'PUT, POST, GET, DELETE, OPTIONS',
        },
        body: JSON.stringify(response, null, 2),
    });
    return;
};
//# sourceMappingURL=apiResponse.js.map