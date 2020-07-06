"use strict";
exports.__esModule = true;
exports.getProducts = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
exports.getProducts = function (event, context, callBack) {
    var limit = 10;
    var params = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        Select: 'ALL_ATTRIBUTES',
    };
    console.log('inside getProducts', params);
    db_1.dynamoDb.scan(params, function (error, result) {
        if (error) {
            return apiResponse_1.errorHandler(callBack, 'ERROR: Couldn\'t fetch the products.', error);
        }
        return apiResponse_1.successHandler(callBack, result);
    });
};
//# sourceMappingURL=getProducts.js.map