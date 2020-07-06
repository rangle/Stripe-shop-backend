"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addProduct = void 0;
var db_1 = require("../../utils/db");
var apiResponse_1 = require("../../utils/apiResponse");
var productCreate_1 = require("../../services/stripe/productCreate");
var ProductValidations_1 = require("../../utils/ProductValidations");
var priceCreate_1 = require("../../services/stripe/priceCreate");
var uuid = require('uuid');
console.log('process.env.DYNAMODB_TABLE_PRODUCTS', process.env.DYNAMODB_TABLE_PRODUCTS);
exports.addProduct = function (event, context, callBack) { return __awaiter(void 0, void 0, void 0, function () {
    var data, timestamp, currency, params, stripeProduct, interval, stripePrice, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                data = JSON.parse(event.body);
                timestamp = new Date().getTime();
                currency = 'cad';
                params = {
                    TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
                    Item: {
                        productId: uuid.v1(),
                        name: data.name,
                        description: data.description,
                        amount: data.amount,
                        currency: currency,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    },
                };
                if (!data.hasSubscription) return [3 /*break*/, 3];
                return [4 /*yield*/, productCreate_1.productCreate({
                        name: data.name,
                        description: data.description,
                    })];
            case 1:
                stripeProduct = _a.sent();
                params.Item.stripeProductId = stripeProduct.id;
                interval = (data.interval && ProductValidations_1.validInterval(data.interval)) ? data.interval : 'month';
                return [4 /*yield*/, priceCreate_1.priceCreate({
                        productId: stripeProduct.id,
                        unit_amount: data.amount,
                        currency: currency,
                        interval: interval,
                    })];
            case 2:
                stripePrice = _a.sent();
                params.Item.stripePriceId = stripePrice.id;
                params.Item.interval = interval;
                _a.label = 3;
            case 3: return [4 /*yield*/, db_1.upsert(params)];
            case 4:
                _a.sent();
                return [2 /*return*/, apiResponse_1.successHandler(callBack, { productId: params.Item.productId })];
            case 5:
                error_1 = _a.sent();
                return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'Error: addProduct failed with exception.', error_1)];
            case 6: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=addProduct.js.map