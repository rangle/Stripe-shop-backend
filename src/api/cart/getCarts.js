"use strict";
exports.__esModule = true;
exports.getCarts = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.getCarts = function (event, context, callBack) {
    var data = JSON.parse(event.body);
    var params = {
        TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
        Select: 'ALL_ATTRIBUTES',
    };
    db_1.dynamoDb.get(params, function (error, result) {
        // handle potential errors
        if (error) {
            console.error(error);
            return apiResponse_1.errorHandler(callBack, 'ERROR: Couldn\'t fetch the order', error);
        }
        // create a response
        return apiResponse_1.successHandler(callBack, result);
    });
};
//# sourceMappingURL=getCarts.js.map