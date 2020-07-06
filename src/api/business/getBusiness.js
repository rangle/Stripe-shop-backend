"use strict";
exports.__esModule = true;
exports.getBusiness = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.getBusiness = function (event, context, callBack) {
    var data = JSON.parse(event.body);
    var params = {
        TableName: process.env.DYNAMODB_TABLE_BUSINESSES,
        Key: {
            businessId: data.businessId,
        },
    };
    db_1.dynamoDb.get(params, function (error, result) {
        if (error) {
            console.error(error);
            return apiResponse_1.errorHandler(callBack, 'ERROR: Couldn\'t fetch the business', error);
        }
        return apiResponse_1.successHandler(callBack, result);
    });
};
//# sourceMappingURL=getBusiness.js.map