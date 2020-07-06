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
exports.startPayment = void 0;
var apiResponse_1 = require("../../utils/apiResponse");
var getCustomerCartUtils_1 = require("../../services/db/getCustomerCartUtils");
var customerCreate_1 = require("../../services/stripe/customerCreate");
var PaymentIntentValidation_1 = require("../../utils/PaymentIntentValidation");
var paymentIntentCreate_1 = require("../../services/stripe/paymentIntentCreate");
exports.startPayment = function (event, context, callBack) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, customerId, payment_method_types, _b, capture_method, _c, billing_details, _d, saveCustomer, items, products, total, stripePI, results, stripeCustomer, paymentIntent, error_1;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = JSON.parse(event.body), customerId = _a.customerId, payment_method_types = _a.payment_method_types, _b = _a.capture_method, capture_method = _b === void 0 ? 'automatic' : _b, _c = _a.billing_details, billing_details = _c === void 0 ? undefined : _c, _d = _a.saveCustomer, saveCustomer = _d === void 0 ? false : _d;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 7, , 8]);
                return [4 /*yield*/, getCustomerCartUtils_1.getCustomerItems(customerId)];
            case 2:
                items = _e.sent();
                if (!items.length) {
                    return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startPayment FAILED!', 'Your Cart is Empty')];
                }
                return [4 /*yield*/, getCustomerCartUtils_1.getItemProducts(items)];
            case 3:
                products = _e.sent();
                total = products.reduce(function (acc, prod) { return (acc += prod.amount); }, 0);
                stripePI = {
                    amount: total,
                    currency: 'usd',
                };
                if (payment_method_types) {
                    stripePI.payment_method_types = payment_method_types;
                }
                if (capture_method) {
                    stripePI.capture_method = capture_method;
                }
                results = PaymentIntentValidation_1.validatePaymentIntent(stripePI);
                if (!results.isValid) {
                    return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR The PaymentIntent contains invalid data!', results.errors)];
                }
                if (!saveCustomer) return [3 /*break*/, 5];
                if (!billing_details) return [3 /*break*/, 5];
                return [4 /*yield*/, customerCreate_1.customerCreate(billing_details)];
            case 4:
                stripeCustomer = _e.sent();
                results.params.customer = stripeCustomer.id;
                _e.label = 5;
            case 5: return [4 /*yield*/, paymentIntentCreate_1.paymentIntentCreate(results.params)];
            case 6:
                paymentIntent = _e.sent();
                return [2 /*return*/, apiResponse_1.successHandler(callBack, {
                        message: 'startPayment Created!',
                        paymentIntent: paymentIntent,
                    })];
            case 7:
                error_1 = _e.sent();
                return [2 /*return*/, apiResponse_1.errorHandler(callBack, 'ERROR startPayment FAILED!', error_1)];
            case 8: return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=startPayment.js.map