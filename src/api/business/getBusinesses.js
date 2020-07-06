"use strict";
exports.__esModule = true;
exports.getBusinesses = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.getBusinesses = function (event, context, callBack) {
    var data = JSON.parse(event.body);
    var params = {
        TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
        Select: 'ALL_ATTRIBUTES',
    };
    db_1.dynamoDb.scan(params, function (error, result) {
        if (error) {
            console.error(error);
            return apiResponse_1.errorHandler(callBack, 'ERROR: Couldn\'t fetch the business', error);
        }
        return apiResponse_1.successHandler(callBack, result);
    });
};
//# sourceMappingURL=getBusinesses.js.map