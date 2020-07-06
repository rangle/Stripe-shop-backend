"use strict";
exports.__esModule = true;
exports.importCustomers = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.importCustomers = function (event, context, callBack) {
    var data = JSON.parse(event.body);
    var params = {
        TableName: process.env.DYNAMODB_TABLE_CUSTOMERS,
    };
    var errors = [];
    var results = [];
    for (var i = 0; i < data.Count; i++) {
        params.Item = data.Items[i];
        db_1.dynamoDb.put(params, function (error, result) {
            if (error) {
                errors.push(params.Item.name);
            }
            else {
                results.push(params.Item.name);
            }
        });
    }
    return apiResponse_1.successHandler(callBack, { errors: errors, results: results });
};
//# sourceMappingURL=importCustomers.js.map