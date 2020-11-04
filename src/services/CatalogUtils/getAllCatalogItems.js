"use strict";
exports.__esModule = true;
var db_1 = require("../../utils/db");
var getCatalogUtil = function (_a) {
    var _b = _a.search, search = _b === void 0 ? '' : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
    var params = {
        TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        Select: 'ALL_ATTRIBUTES',
    };
    db_1.dynamoDb.scan(params, (error, result)).then();
};
exports["default"] = getCatalogUtil;
//# sourceMappingURL=getCatalogUtils.js.map