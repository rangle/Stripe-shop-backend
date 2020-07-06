"use strict";
exports.__esModule = true;
exports.validatePaymentIntent = void 0;
exports.validatePaymentIntent = function (dataIn) {
    var _a, _b, _c;
    var errors = {};
    if (dataIn.amount <= 0) {
        errors['amount'] = 'Amount must be a positive number';
    }
    var params = {
        amount: dataIn.amount,
        currency: (_a = dataIn.currency) !== null && _a !== void 0 ? _a : 'cad',
        payment_method_types: (_b = dataIn.payment_method_types) !== null && _b !== void 0 ? _b : ['card'],
        capture_method: (dataIn.capture_method === 'manual') ? 'manual' : 'automatic',
        off_session: (_c = (dataIn.off_session)) !== null && _c !== void 0 ? _c : false,
    };
    // if(params.capture_method === 'manual' && params.off_session) {
    //     errors['offSession'] = 'When Using Off Session Payments, capture_method must be automatic';
    // }
    if (dataIn.customer)
        params.customer = dataIn.customer;
    if (dataIn.description)
        params.description = dataIn.description;
    if (dataIn.metadata)
        params.metadata = dataIn.metadata;
    return (Object.keys(errors).length === 0)
        ? { isValid: true, params: params }
        : { isValid: false, errors: errors };
};
//# sourceMappingURL=PaymentIntentValidation.js.map