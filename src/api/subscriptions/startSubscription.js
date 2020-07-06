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
exports.startSubscription = void 0;
var apiResponse_1 = require("../../utils/apiResponse");
var getCustomerCartUtils_1 = require("../../services/db/getCustomerCartUtils");
var customerRead_1 = require("../../services/db/customerRead");
var customerCreate_1 = require("../../services/stripe/customerCreate");
var customerWrite_1 = require("../../services/db/customerWrite");
var subscriptionCreate_1 = require("../../services/stripe/subscriptionCreate");
exports.startSubscription = function (event, context, callBack) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, customer, items, products, keyedItems_1, customerSubs, stripeCustomer, savedCustomer, subscription, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerId = JSON.parse(event.body).customerId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, customerRead_1.customerRead(customerId)];
            case 2:
                customer = _a.sent();
                if (!customer) {
                    return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startSubscription FAILED!', 'The customer was not found')];
                }
                ;
                return [4 /*yield*/, getCustomerCartUtils_1.getCustomerItems(customerId)];
            case 3:
                items = _a.sent();
                if (!items.length) {
                    return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startSubscription FAILED!', 'Your Cart is empty')];
                }
                ;
                return [4 /*yield*/, getCustomerCartUtils_1.getSubscriptionItems(items)];
            case 4:
                products = _a.sent();
                if (!products.length) {
                    return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startSubscription FAILED!', 'Your Cart has no Subscriptions')];
                }
                ;
                keyedItems_1 = items.reduce(function (acc, item) {
                    acc[item.productId] = item;
                    return acc;
                }, {});
                customerSubs = products.map(function (item) { return ({
                    price: item.stripePriceId,
                    quantity: keyedItems_1[item.productId].quantity,
                }); });
                if (!!customer.StripeCustomerId) return [3 /*break*/, 7];
                return [4 /*yield*/, customerCreate_1.customerCreate(customer)];
            case 5:
                stripeCustomer = _a.sent();
                customer.StripeCustomerId = stripeCustomer.id;
                console.log('Added stripeCustomer', stripeCustomer);
                return [4 /*yield*/, customerWrite_1.customerWrite(customer)];
            case 6:
                savedCustomer = _a.sent();
                _a.label = 7;
            case 7: return [4 /*yield*/, subscriptionCreate_1.subscriptionCreate(customer.StripeCustomerId, customerSubs)];
            case 8:
                subscription = _a.sent();
                console.log('subscription', subscription);
                return [2 /*return*/, apiResponse_1.successHandler(callBack, {
                        message: 'subscription Created!',
                        subscription: subscription,
                    })];
            case 9:
                error_1 = _a.sent();
                console.log('oops something went wrong', error_1);
                return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startPayment FAILED!', error_1)];
            case 10: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=startSubscription.js.map