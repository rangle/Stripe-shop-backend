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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.confirmCustomerOrder = exports.customerCartToOrder = exports.saveCustomerOrder = exports.getCustomerOrders = void 0;
var db_1 = require("../../utils/db");
var getCustomerCartUtils_1 = require("./getCustomerCartUtils");
var uuid = require('uuid');
var timestamp = new Date().getTime();
exports.getCustomerOrders = function (customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var params, customerItems;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('customerId', customerId);
                params = {
                    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
                    FilterExpression: 'customerId = :id',
                    ExpressionAttributeValues: { ':id': customerId },
                };
                return [4 /*yield*/, db_1.search(params)];
            case 1:
                customerItems = _a.sent();
                console.log('customerItems', customerItems);
                return [2 /*return*/, customerItems];
        }
    });
}); };
exports.saveCustomerOrder = function (customerId, orderItems, orderTotal, shippingAmount) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, params, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                orderId = uuid.v1();
                params = {
                    TableName: process.env.DYNAMODB_TABLE_ORDERS,
                    Item: {
                        orderId: orderId,
                        customerId: customerId,
                        products: orderItems,
                        orderTotal: orderTotal,
                        shippingAmount: shippingAmount,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                        orderStatus: 'pending',
                    },
                };
                console.log('saveCustomerOrder', params);
                return [4 /*yield*/, db_1.upsert(params)];
            case 1:
                _a.sent();
                return [2 /*return*/, params.Item];
            case 2:
                error_1 = _a.sent();
                console.log('unable to save order', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateCartAsOrdered = function (orderItems, OrderId) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('updateCartAsOrdered.OrderId', OrderId);
                params = {
                    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
                    Key: { cartItemId: undefined },
                    UpdateExpression: 'set OrderPendingId = :OrderId',
                    ExpressionAttributeValues: {
                        ':OrderId': OrderId,
                    },
                };
                return [4 /*yield*/, db_1.updateBatchData(orderItems, params, 'cartItemId')];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.customerCartToOrder = function (_a) {
    var customerId = _a.customerId, shippingAmount = _a.shippingAmount;
    return __awaiter(void 0, void 0, void 0, function () {
        var cartItems, products, orderTotal, orderItems, order, result, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, getCustomerCartUtils_1.getCustomerCart(customerId)];
                case 1:
                    cartItems = _b.sent();
                    if (cartItems.length === 0) {
                        console.log('cart empty');
                        throw new Error('The cart contains no items');
                    }
                    return [4 /*yield*/, getCustomerCartUtils_1.getItemProducts(cartItems)];
                case 2:
                    products = _b.sent();
                    orderTotal = products.reduce(function (acc, prod) { return (acc += prod.amount); }, 0);
                    orderItems = cartItems.reduce(function (orderItems, item) {
                        var orderItem = {
                            productId: item.productId,
                            cartItemId: item.cartItemId,
                            quantity: item.quantity,
                        };
                        return __spreadArrays(orderItems, [orderItem]);
                    }, []);
                    return [4 /*yield*/, exports.saveCustomerOrder(customerId, orderItems, orderTotal, shippingAmount)];
                case 3:
                    order = _b.sent();
                    console.log('new Order: ', order);
                    return [4 /*yield*/, updateCartAsOrdered(orderItems, order.orderId)];
                case 4:
                    result = _b.sent();
                    console.log('result', { result: result, order: order });
                    return [2 /*return*/, order];
                case 5:
                    error_2 = _b.sent();
                    console.log('unable to save order', error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
exports.confirmCustomerOrder = function (orderId, customerId) { return __awaiter(void 0, void 0, void 0, function () {
    var error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, updateOrderStatus(orderId, 'ordered')];
            case 1:
                _a.sent();
                return [4 /*yield*/, deleteOrderedItemsFromCart(customerId, orderId)];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                error_3 = _a.sent();
                console.log('update Order Status failed: ', error_3);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateOrderStatus = function (orderId, status) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: process.env.DYNAMODB_TABLE_ORDERS,
                    Key: { orderId: orderId },
                    UpdateExpression: 'set orderStatus = :status',
                    ExpressionAttributeValues: {
                        ':status': status,
                    },
                    ReturnValues: 'UPDATED_NEW',
                };
                return [4 /*yield*/, db_1.updateItem(params)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var deleteOrderedItemsFromCart = function (customerId, orderId) { return __awaiter(void 0, void 0, void 0, function () {
    var cartItems, itemsToDelete, params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getCustomerCartUtils_1.getCustomerItems(customerId)];
            case 1:
                cartItems = _a.sent();
                console.log('cartItems, orderId', { cartItems: cartItems, orderId: orderId });
                itemsToDelete = cartItems
                    .filter(function (cartItem) { return cartItem.OrderPendingId === orderId; })
                    .reduce(function (acc, cartItem) {
                    return __spreadArrays(acc, [cartItem.cartItemId]);
                }, []);
                params = {
                    TableName: process.env.DYNAMODB_TABLE_CARTITEMS,
                    Key: { cartItemId: undefined },
                };
                console.log('itemsToDelete', itemsToDelete);
                return [4 /*yield*/, db_1.batchDelete(params, itemsToDelete, 'cartItemId')];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=customerOrderUtils.js.map