"use strict";
exports.__esModule = true;
exports.getOrders = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.getOrders = function (event, context, callBack) {
    var data = JSON.parse(event.body);
    var params = {
        TableName: process.env.DYNAMODB_TABLE_ORDERS,
        Select: 'ALL_ATTRIBUTES',
    };
    db_1.dynamoDb.scan(params, function (error, result) {
        if (error) {
            console.error(error);
            return apiResponse_1.errorHandler(callBack, 'ERROR: Couldn\'t fetch the customer', error);
        }
        return apiResponse_1.successHandler(callBack, result);
    });
};
//# sourceMappingURL=getOrders.js.map