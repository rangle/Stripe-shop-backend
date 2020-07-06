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
exports.__esModule = true;
exports.validateBusiness = void 0;
var uuid = require("uuid");
exports.validateBusiness = function (dataIn) {
    var errors = {};
    var timestamp = new Date().getTime();
    var params = {
        businessId: uuid.v1(),
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    var required = [
        'businessName',
        'email',
        'address',
    ];
    var optional = [
        'contactName',
        'phone',
    ];
    var reqParams = {
        businessName: '',
        email: '',
        address: {
            line1: '',
            city: '',
            country: '',
            postalCode: '',
        },
    };
    required.map(function (key) {
        dataIn[key] && (reqParams[key] = dataIn[key]) || (errors[key] = 'Is a required field');
    });
    if (Object.keys(errors).length > 0) {
        return { isValid: false, errors: errors };
    }
    var optParams = {};
    optional.map(function (key) {
        dataIn[key] && dataIn[key].length && (optParams[key] = dataIn[key]);
    });
    var finalParams = __assign(__assign(__assign({}, optParams), reqParams), params);
    return { isValid: true, params: finalParams };
};
//# sourceMappingURL=BusinessValidations.js.map