"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.updateBatchData = exports.batchUpsert = exports.update = exports.search = exports.get = exports.deleteItem = exports.batchDelete = exports.updateItem = exports.upsert = exports.dynamoDb = void 0;
require("source-map-support/register");
var AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies
var isOffline = process.env.IS_OFFLINE;
var dynamoDB_endpoint = process.env.CONFIG_DYNAMODB_ENDPOINT;
exports.dynamoDb = isOffline
    ? new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: dynamoDB_endpoint,
    })
    : new AWS.DynamoDB.DocumentClient();
exports.upsert = function (params) {
    return new Promise(function (resolve, reject) {
        // params.ReturnValues = 'ALL_NEW';
        console.log('upsert(params)', params);
        exports.dynamoDb.put(params, function (error, result) {
            if (error) {
                error.source = 'My DynamoDB Exception';
                console.log('DB Error: upsert failed with ', error);
                reject({ error: error });
            }
            else {
                console.log('DB SUCCESS: upsert resolved with ', result);
                resolve({ result: params.Item });
            }
        });
    });
};
exports.updateItem = function (params) {
    return new Promise(function (resolve, reject) {
        // params.ReturnValues = 'ALL_NEW';
        console.log('updateItem(params)', params);
        exports.dynamoDb.update(params, function (error, result) {
            if (error) {
                error.source = 'My DynamoDB Exception';
                console.log('DB Error: Item update failed with ', error);
                reject({ error: error });
            }
            else {
                console.log('DB SUCCESS: Item update resolved with ', params.Key);
                resolve({ result: params.Key });
            }
        });
    });
};
exports.batchDelete = function (params, data, key) { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log = [];
                return [4 /*yield*/, data.reduce(function (acc, item) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('batchDelete: item', item);
                                    params.Key[key] = item;
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, exports.deleteItem(params)];
                                case 2:
                                    _a.sent();
                                    console.log('post batchDelete item', item);
                                    log.push({ success: item[key] });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    console.log('post batchDelete item', item);
                                    log.push({ failed: item[key] });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, [])];
            case 1:
                _a.sent();
                return [2 /*return*/, log];
        }
    });
}); };
exports.deleteItem = function (params) {
    return new Promise(function (resolve, reject) {
        exports.dynamoDb["delete"](params, function (error, result) {
            if (error) {
                error.source = 'My DynamoDB Exception';
                console.log('DB Error: Item delete failed with ', { params: params, error: error });
                reject({ error: error });
            }
            else {
                console.log('DB SUCCESS: Item delete resolved with ', { params: params, result: result });
                resolve({ params: params, result: result });
            }
        });
    });
};
exports.get = function (params) {
    return new Promise(function (resolve, reject) {
        exports.dynamoDb.get(params, function (error, result) {
            // handle potential errors
            if (error) {
                console.error(error);
                return reject({ error: "ERROR: Couldn't fetch the order", message: error });
            }
            // create a response
            return resolve(result);
        });
    });
};
exports.search = function (params) {
    return new Promise(function (resolve, reject) {
        try {
            exports.dynamoDb.query(params, function (error, result) {
                // handle potential errors
                if (error) {
                    return reject({ message: 'ERROR: DynamoDB.get', error: error });
                }
                if (!result) {
                    return reject({ message: 'ERROR: DynamoDB.get empty' });
                }
                // create a response
                console.log('SUCCESS: DynamoDB.get: ', result);
                return resolve(result.Items);
            });
        }
        catch (error) {
            return reject({ message: 'ERROR: DynamoDB.get', error: error });
        }
    });
};
exports.update = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                exports.dynamoDb.update(params, function (error, result) {
                    if (error) {
                        return reject({ message: 'ERROR: DynamoDb.get' });
                    }
                });
            })];
    });
}); };
exports.batchUpsert = function (data, table) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = {
                    TableName: table,
                };
                return [4 /*yield*/, putBatchData(data, params)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
var putBatchData = function (data, params) { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log = [];
                return [4 /*yield*/, data.reduce(function (acc, item) { return __awaiter(void 0, void 0, void 0, function () {
                        var myparams, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    myparams = __assign(__assign({}, params), { Item: item });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, exports.upsert(myparams)];
                                case 2:
                                    _a.sent();
                                    log.push({ success: item.name });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_2 = _a.sent();
                                    log.push({ failed: item.name });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, [])];
            case 1:
                _a.sent();
                return [2 /*return*/, log];
        }
    });
}); };
exports.updateBatchData = function (data, params, key) { return __awaiter(void 0, void 0, void 0, function () {
    var log;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                log = [];
                return [4 /*yield*/, data.reduce(function (acc, item) { return __awaiter(void 0, void 0, void 0, function () {
                        var error_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log('updateBatchData: item', item);
                                    params.Key[key] = item[key];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, exports.updateItem(params)];
                                case 2:
                                    _a.sent();
                                    console.log('post upsert item', item);
                                    log.push({ success: item[key] });
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_3 = _a.sent();
                                    console.log('post upsert item', item);
                                    log.push({ failed: item[key] });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); }, [])];
            case 1:
                _a.sent();
                return [2 /*return*/, log];
        }
    });
}); };
//
// const delete = async (params: any): Promise<any> => {
//
// };
//# sourceMappingURL=db.js.map