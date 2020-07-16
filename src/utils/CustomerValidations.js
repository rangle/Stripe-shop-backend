"use strict";
exports.__esModule = true;
exports.validateCustomer = void 0;
var uuid = require("uuid");
exports.validateCustomer = function (dataIn) {
    var errors = {};
    var timestamp = new Date().getTime();
    var params = {
        customerId: dataIn.customerId ? dataIn.customerId : uuid.v1(),
        createdAt: timestamp,
        updatedAt: timestamp,
    };
    if (dataIn.name)
        params.name = dataIn.name;
    if (dataIn.phone)
        params.phone = dataIn.phone;
    if (dataIn.email)
        params.email = dataIn.email;
    if (dataIn.address)
        params.address = dataIn.address;
    if (dataIn.StripeCustomerId)
        params.StripeCustomerId = dataIn.StripeCustomerId;
    console.log('validated customer', { dataIn: dataIn, params: params });
    return Object.keys(errors).length === 0 ? { isValid: true, params: params } : { isValid: false, errors: errors };
};
//# sourceMappingURL=CustomerValidations.js.map